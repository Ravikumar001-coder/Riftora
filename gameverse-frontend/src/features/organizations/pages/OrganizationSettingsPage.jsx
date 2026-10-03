import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Settings, Building2, Image as ImageIcon, Link as LinkIcon, 
  Mail, Globe, Bell, ShieldAlert, Trash2, Save, Undo2, CheckCircle2,
  AlertTriangle, Upload, X, ChevronRight, Check
} from 'lucide-react';
import { mockOrganizationSettings } from '../../../portals/organizer/data/mockSettings';
import { organizerDashboardData } from '../../../portals/organizer/data/mockOrganizerData';
import { useOrganizationBySlugQuery, useOrganizationMembersQuery } from '../api/useOrganizationQueries';
import { useOrganizationMutations } from '../api/useOrganizationMutations';
import { BrandKitPanel } from '../components/BrandKitPanel';
import { YoutubeIntegrationPanel } from '../../broadcast/components/YoutubeIntegrationPanel';

const SETTINGS_SECTIONS = [
  { id: 'general', label: 'General', icon: Building2 },
  { id: 'branding', label: 'Branding', icon: ImageIcon },
  { id: 'url', label: 'Organization URL', icon: LinkIcon },
  { id: 'contact', label: 'Contact & Localization', icon: Globe },
  { id: 'privacy', label: 'Privacy & Visibility', icon: ShieldAlert },
  { id: 'integrations', label: 'Integrations', icon: LinkIcon },
  { id: 'memberDefaults', label: 'Member Defaults', icon: Settings },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'danger', label: 'Danger Zone', icon: Trash2 }
];

export function OrganizationSettingsPage() {
  const { orgSlug } = useParams();
  
  const { data: orgData, isLoading } = useOrganizationBySlugQuery(orgSlug);
  const { updateOrganizationSettings } = useOrganizationMutations();

  // States
  const [initialState, setInitialState] = useState(mockOrganizationSettings);
  const [formData, setFormData] = useState(mockOrganizationSettings);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('general');
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  
  // Modals
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferUserId, setTransferUserId] = useState('');
  
  const { initiateOwnershipTransfer } = useOrganizationMutations();
  const { data: members = [] } = useOrganizationMembersQuery(orgData?.orgId, { enabled: !!orgData?.orgId && isTransferModalOpen });

  const handleTransferSubmit = () => {
    if (!transferUserId) return;
    initiateOwnershipTransfer.mutate(
      { orgId: orgData.orgId, toUserId: transferUserId },
      {
        onSuccess: () => {
          setIsTransferModalOpen(false);
          setToastMessage('Ownership transfer initiated. The user must accept the request.');
          setTimeout(() => setToastMessage(null), 3000);
        }
      }
    );
  };

  // Refs for scrolling to sections
  const sectionRefs = useRef({});

  // Organization name fallback
  const orgName = orgData ? orgData.orgName : orgSlug?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Determine current user's role (Mocked as Authorized)
  const isAuthorized = true; // Assume Org Owner

  useEffect(() => {
    if (orgData) {
      const mappedData = {
        ...mockOrganizationSettings,
        general: {
          name: orgData.orgName || '',
          shortDescription: mockOrganizationSettings.general.shortDescription, // Mock
          description: orgData.description || '',
          type: 'Esports Organization' // Mock
        },
        branding: {
          logoUrl: orgData.logoUrl || null,
          bannerUrl: orgData.bannerUrl || null,
          primaryColor: orgData.primaryColor || '#2563EB',
          secondaryColor: orgData.secondaryColor || '#1E40AF',
          primaryFont: orgData.primaryFont || 'Inter',
          secondaryFont: orgData.secondaryFont || 'Roboto',
        },
        houseRules: orgData.houseRules || '',
        url: {
          slug: orgData.orgSlug || orgSlug,
          customSubdomain: orgData.customSubdomain || ''
        },
        contact: {
          email: orgData.contactEmail || '',
          phone: '',
          website: orgData.websiteUrl || '',
          socialLinks: { 
            discord: orgData.discordLink || '',
            instagram: orgData.instagramHandle || '',
            youtube: orgData.youtubeUrl || '',
            twitter: '',
            twitch: ''
          }
        },
        localization: {
          ...mockOrganizationSettings.localization,
          language: orgData.preferredLanguage ? orgData.preferredLanguage.charAt(0) + orgData.preferredLanguage.slice(1).toLowerCase() : 'English',
        },
        privacy: {
          ...mockOrganizationSettings.privacy,
          visibility: orgData.visibility ? orgData.visibility.charAt(0) + orgData.visibility.slice(1).toLowerCase() : 'Public',
        }
      };
      setInitialState(mappedData);
      setFormData(mappedData);
    }
  }, [orgData, orgSlug]);

  useEffect(() => {
    // Check if form is dirty
    const currentStr = JSON.stringify(formData);
    const initialStr = JSON.stringify(initialState);
    setIsDirty(currentStr !== initialStr);
  }, [formData, initialState]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-slate-400 max-w-md">You do not have permission to manage settings for this organization. Only Organization Owners and Admins can access this page.</p>
        <Link to={`/organizations/${orgSlug}/manage/overview`} className="mt-6 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // --- Helpers ---
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const scrollToSection = (id) => {
    setActiveSection(id);
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --- Handlers ---
  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    // Clear error for this field if any
    if (errors[`${section}.${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${section}.${field}`];
        return newErrors;
      });
    }
  };

  const handleDeepNestedChange = (section, subSection, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subSection]: {
          ...prev[section][subSection],
          [field]: value
        }
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.general.name.trim()) newErrors['general.name'] = 'Organization name is required';
    if (formData.general.name.length > 50) newErrors['general.name'] = 'Name must be less than 50 characters';
    
    // Slug validation
    const slugRegex = /^[a-z0-9-]+$/;
    if (!formData.url.slug.trim()) newErrors['url.slug'] = 'Slug is required';
    else if (!slugRegex.test(formData.url.slug)) newErrors['url.slug'] = 'Slug can only contain lowercase letters, numbers, and hyphens';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.contact.email && !emailRegex.test(formData.contact.email)) newErrors['contact.email'] = 'Invalid email format';

    // Website validation
    try {
      if (formData.contact.website && formData.contact.website.trim() !== '') {
        new URL(formData.contact.website);
      }
    } catch {
      newErrors['contact.website'] = 'Invalid URL format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showToast('Please fix the errors before saving.');
      return;
    }
    
    setIsSaving(true);
    try {
      const updateData = {
        orgName: formData.general.name,
        description: formData.general.description,
        contactEmail: formData.contact.email,
        websiteUrl: formData.contact.website,
        instagramHandle: formData.contact.socialLinks.instagram,
        youtubeUrl: formData.contact.socialLinks.youtube,
        discordLink: formData.contact.socialLinks.discord,
        visibility: formData.privacy.visibility.toUpperCase(),
        preferredLanguage: formData.localization.language.toUpperCase(),
        houseRules: formData.houseRules,
        customSubdomain: formData.url.customSubdomain
      };
      
      await updateOrganizationSettings.mutateAsync({ orgId: orgData.orgId, data: updateData });
      
      setInitialState(formData);
      setIsDirty(false);
      showToast('Settings saved successfully!');
    } catch (error) {
      showToast('Error saving settings. Please try again.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setIsResetModalOpen(true);
  };

  const confirmReset = () => {
    setFormData(initialState);
    setErrors({});
    setIsDirty(false);
    setIsResetModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteConfirmText === formData.general.name) {
      showToast('Organization deletion will be available when backend persistence is connected.');
      setIsDeleteModalOpen(false);
      setDeleteConfirmText('');
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-24 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-4">
          <div className="bg-slate-800 border border-slate-700 shadow-xl rounded-lg px-4 py-3 flex items-center gap-3">
            {toastMessage.includes('error') || toastMessage.includes('fix') ? (
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            )}
            <p className="text-white text-sm font-medium">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-slate-500 font-medium mb-6 px-2 lg:px-0">
        <Link to="/dashboard/organizer" className="hover:text-white transition-colors">Organizations</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link to={`/organizations/${orgSlug}/manage/overview`} className="hover:text-white transition-colors">{orgName}</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-blue-500">Settings</span>
      </nav>

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 px-2 lg:px-0">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Organization Settings</h1>
          <p className="text-slate-400">Manage your organization profile, branding, preferences, and administrative settings.</p>
        </div>
        
        {/* Top Action Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <button 
            onClick={handleReset}
            disabled={!isDirty || isSaving}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors flex items-center gap-2"
          >
            <Undo2 className="w-4 h-4" /> Reset
          </button>
          <button 
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)] disabled:shadow-none flex items-center gap-2"
          >
            {isSaving ? <CheckCircle2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </header>

      {/* Layout Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Sidebar Navigation */}
        <div className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24 bg-slate-900/50 lg:bg-transparent border lg:border-none border-slate-800 p-2 lg:p-0 rounded-2xl lg:rounded-none overflow-x-auto lg:overflow-visible">
          <nav className="flex lg:flex-col gap-1 min-w-max lg:min-w-0">
            {SETTINGS_SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeSection === section.id 
                    ? 'bg-blue-500/10 text-blue-400' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-300'
                }`}
              >
                <section.icon className={`w-4 h-4 ${activeSection === section.id ? 'text-blue-400' : 'text-slate-500'}`} />
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 w-full flex flex-col gap-8">
          
          {/* General Section */}
          <section id="general" ref={el => sectionRefs.current['general'] = el} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 scroll-mt-24">
            <h2 className="text-xl font-bold text-white mb-6">General Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Organization Name <span className="text-red-400">*</span></label>
                <input 
                  type="text" 
                  value={formData.general.name}
                  onChange={(e) => handleNestedChange('general', 'name', e.target.value)}
                  className={`w-full bg-slate-950 border ${errors['general.name'] ? 'border-red-500 focus:ring-red-500/50' : 'border-slate-800 focus:ring-blue-500/50'} text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2`}
                />
                {errors['general.name'] && <p className="text-xs text-red-400 mt-1">{errors['general.name']}</p>}
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-slate-300">Short Description</label>
                  <span className="text-xs text-slate-500">{formData.general.shortDescription.length}/150</span>
                </div>
                <textarea 
                  value={formData.general.shortDescription}
                  onChange={(e) => handleNestedChange('general', 'shortDescription', e.target.value.substring(0, 150))}
                  rows="2"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                ></textarea>
                <p className="text-xs text-slate-500 mt-1">A brief summary appearing on your public profile header.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Detailed Description</label>
                <textarea 
                  value={formData.general.description}
                  onChange={(e) => handleNestedChange('general', 'description', e.target.value)}
                  rows="4"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Organization Type</label>
                <select 
                  value={formData.general.type}
                  onChange={(e) => handleNestedChange('general', 'type', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="Esports Organization">Esports Organization</option>
                  <option value="Tournament Organizer">Tournament Organizer</option>
                  <option value="Gaming Community">Gaming Community</option>
                  <option value="Content Creator">Content Creator</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-slate-300">House Rules</label>
                  <span className="text-xs text-slate-500">{formData.houseRules?.length || 0}/5000</span>
                </div>
                <textarea 
                  value={formData.houseRules || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, houseRules: e.target.value.substring(0, 5000) }))}
                  rows="6"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Enter organization-level house rules that will act as the default rulebook for all tournaments..."
                ></textarea>
                <p className="text-xs text-slate-500 mt-1">Default rulebook for all tournaments under this organization.</p>
              </div>
            </div>
          </section>

          {/* Branding Section */}
          <section id="branding" ref={el => sectionRefs.current['branding'] = el} className="scroll-mt-24">
            <BrandKitPanel organization={orgData} />
          </section>

          {/* Organization URL Section */}
          <section id="url" ref={el => sectionRefs.current['url'] = el} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 scroll-mt-24">
            <h2 className="text-xl font-bold text-white mb-6">Organization URL</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Organization Slug <span className="text-red-400">*</span></label>
              <div className="flex items-center">
                <div className="px-4 py-2.5 bg-slate-950 border border-r-0 border-slate-800 rounded-l-lg text-slate-500 text-sm select-none">
                  riftora.com/organizations/
                </div>
                <input 
                  type="text" 
                  value={formData.url.slug}
                  onChange={(e) => {
                    // Auto normalize lowercase and replace spaces with hyphens
                    const normalized = e.target.value.toLowerCase().replace(/\s+/g, '-');
                    handleNestedChange('url', 'slug', normalized);
                  }}
                  className={`flex-1 min-w-0 bg-slate-950 border ${errors['url.slug'] ? 'border-red-500 focus:ring-red-500/50 z-10' : 'border-slate-800 focus:ring-blue-500/50'} text-white rounded-r-lg px-4 py-2.5 focus:outline-none focus:ring-2`}
                />
              </div>
              {errors['url.slug'] && <p className="text-xs text-red-400 mt-1">{errors['url.slug']}</p>}
              <p className="text-xs text-slate-500 mt-2">Changing your slug will break existing links to your organization profile.</p>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-300 mb-1">Custom Subdomain</label>
              <div className="flex items-center">
                <input 
                  type="text" 
                  value={formData.url.customSubdomain}
                  onChange={(e) => {
                    const normalized = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                    handleNestedChange('url', 'customSubdomain', normalized);
                  }}
                  className={`flex-1 min-w-0 bg-slate-950 border border-slate-800 text-white rounded-l-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  placeholder="my-org"
                />
                <div className="px-4 py-2.5 bg-slate-950 border border-l-0 border-slate-800 rounded-r-lg text-slate-500 text-sm select-none">
                  .riftora.com
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2 mb-4">Optional. Access your organization directly via a dedicated subdomain.</p>
              
              {formData.url.customSubdomain && (
                <div className="mt-4 bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 flex gap-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg h-fit">
                    <Globe className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       <h4 className="text-sm font-bold text-white">DNS Configuration Required</h4>
                       <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-[10px] font-bold uppercase">Elite Plan</span>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">
                      To activate your custom subdomain, you must configure a CNAME record with your DNS provider (e.g. GoDaddy, Cloudflare). SSL certificates are automatically provisioned via Let's Encrypt once verified.
                    </p>
                    <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase">
                          <tr>
                            <th className="px-4 py-2 font-medium">Type</th>
                            <th className="px-4 py-2 font-medium">Host / Name</th>
                            <th className="px-4 py-2 font-medium">Value / Target</th>
                          </tr>
                        </thead>
                        <tbody className="text-slate-300 font-mono">
                          <tr>
                            <td className="px-4 py-3 border-t border-slate-800">CNAME</td>
                            <td className="px-4 py-3 border-t border-slate-800">{formData.url.customSubdomain}</td>
                            <td className="px-4 py-3 border-t border-slate-800 text-emerald-400">custom.gameverse.gg</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Contact & Localization */}
          <section id="contact" ref={el => sectionRefs.current['contact'] = el} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 scroll-mt-24">
            <h2 className="text-xl font-bold text-white mb-6">Contact & Localization</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Contact Email</label>
                <input 
                  type="email" 
                  value={formData.contact.email}
                  onChange={(e) => handleNestedChange('contact', 'email', e.target.value)}
                  className={`w-full bg-slate-950 border ${errors['contact.email'] ? 'border-red-500' : 'border-slate-800'} text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                />
                {errors['contact.email'] && <p className="text-xs text-red-400 mt-1">{errors['contact.email']}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Contact Phone</label>
                <input 
                  type="text" 
                  value={formData.contact.phone}
                  onChange={(e) => handleNestedChange('contact', 'phone', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1">Website</label>
                <input 
                  type="url" 
                  value={formData.contact.website}
                  onChange={(e) => handleNestedChange('contact', 'website', e.target.value)}
                  className={`w-full bg-slate-950 border ${errors['contact.website'] ? 'border-red-500' : 'border-slate-800'} text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  placeholder="https://example.com"
                />
                {errors['contact.website'] && <p className="text-xs text-red-400 mt-1">{errors['contact.website']}</p>}
              </div>
            </div>

            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Social Links</h3>
            <div className="space-y-4 mb-8 border-b border-slate-800 pb-8">
              {['discord', 'twitter', 'instagram', 'youtube', 'twitch'].map((platform) => (
                <div key={platform} className="flex items-center">
                  <div className="w-10 h-10 bg-slate-950 border border-r-0 border-slate-800 rounded-l-lg flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4 text-slate-500" />
                  </div>
                  <input 
                    type="url" 
                    value={formData.contact.socialLinks[platform] || ''}
                    onChange={(e) => handleDeepNestedChange('contact', 'socialLinks', platform, e.target.value)}
                    placeholder={`https://${platform}.com/your-org`}
                    className="flex-1 w-full bg-slate-950 border border-slate-800 text-white rounded-r-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              ))}
            </div>

            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Localization Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Time Zone</label>
                <select 
                  value={formData.localization.timezone}
                  onChange={(e) => handleNestedChange('localization', 'timezone', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Language</label>
                <select 
                  value={formData.localization.language}
                  onChange={(e) => handleNestedChange('localization', 'language', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Date Format</label>
                <select 
                  value={formData.localization.dateFormat}
                  onChange={(e) => handleNestedChange('localization', 'dateFormat', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Time Format</label>
                <select 
                  value={formData.localization.timeFormat}
                  onChange={(e) => handleNestedChange('localization', 'timeFormat', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="12-hour">12-hour (AM/PM)</option>
                  <option value="24-hour">24-hour</option>
                </select>
              </div>
            </div>
          </section>

          {/* Privacy & Visibility */}
          <section id="privacy" ref={el => sectionRefs.current['privacy'] = el} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 scroll-mt-24">
            <h2 className="text-xl font-bold text-white mb-6">Privacy & Visibility</h2>
            
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-800 pb-6">
                <div>
                  <h3 className="font-medium text-white mb-1">Organization Profile Visibility</h3>
                  <p className="text-sm text-slate-400 max-w-md">Public profiles can be viewed by anyone. Private profiles are only visible to active members.</p>
                </div>
                <select 
                  value={formData.privacy.visibility}
                  onChange={(e) => handleNestedChange('privacy', 'visibility', e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full sm:w-auto"
                >
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                </select>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                  <h3 className="font-medium text-white mb-1">Search Discoverability</h3>
                  <p className="text-sm text-slate-400 max-w-md">Allow this organization to appear in Riftora's public search and directory.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.privacy.discoverable}
                    onChange={(e) => handleNestedChange('privacy', 'discoverable', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-medium text-white mb-1">Public Tournament Visibility</h3>
                  <p className="text-sm text-slate-400 max-w-md">Allow organization tournaments to appear on the public tournaments feed by default.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.privacy.publicTournaments}
                    onChange={(e) => handleNestedChange('privacy', 'publicTournaments', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Integrations */}
          <section id="integrations" ref={el => sectionRefs.current['integrations'] = el} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 scroll-mt-24">
            <h2 className="text-xl font-bold text-white mb-6">Integrations & Connected Apps</h2>
            
            <div className="space-y-6">
              <YoutubeIntegrationPanel orgId={orgData?.orgId} />
            </div>
          </section>

          {/* Member Defaults */}
          <section id="memberDefaults" ref={el => sectionRefs.current['memberDefaults'] = el} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 scroll-mt-24">
            <h2 className="text-xl font-bold text-white mb-6">Member Defaults</h2>
            
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-800 pb-6">
                <div>
                  <h3 className="font-medium text-white mb-1">Default Member Role</h3>
                  <p className="text-sm text-slate-400 max-w-md">The default permission level assigned to new users when they join the organization.</p>
                </div>
                <select 
                  value={formData.memberDefaults.defaultRole}
                  onChange={(e) => handleNestedChange('memberDefaults', 'defaultRole', e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full sm:w-auto"
                >
                  <option value="Viewer">Viewer</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                  <h3 className="font-medium text-white mb-1">Member Invitations</h3>
                  <p className="text-sm text-slate-400 max-w-md">Allow organization admins and staff to invite new members.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.memberDefaults.allowInvites}
                    onChange={(e) => handleNestedChange('memberDefaults', 'allowInvites', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-medium text-white mb-1">Require Approval</h3>
                  <p className="text-sm text-slate-400 max-w-md">Require an owner or admin to approve new member join requests.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.memberDefaults.requireApproval}
                    onChange={(e) => handleNestedChange('memberDefaults', 'requireApproval', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section id="notifications" ref={el => sectionRefs.current['notifications'] = el} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 scroll-mt-24">
            <h2 className="text-xl font-bold text-white mb-6">Notifications</h2>
            
            <div className="space-y-6">
              {[
                { key: 'registrations', title: 'Tournament registrations', desc: 'Receive notifications when new teams or players register for your active tournaments.' },
                { key: 'scheduleChanges', title: 'Tournament schedule changes', desc: 'Notify organization administrators when tournament schedules are modified.' },
                { key: 'memberActivity', title: 'Member activity', desc: 'Alerts when members join, leave, or change roles within the organization.' },
                { key: 'announcements', title: 'Organization announcements', desc: 'Allow members to receive global announcements sent by admins.' },
                { key: 'disputes', title: 'Dispute notifications', desc: 'Receive immediate alerts when a match dispute is filed.' },
                { key: 'system', title: 'System notifications', desc: 'Important billing, limits, and platform-level alerts. (Recommended)' }
              ].map((item, index, arr) => (
                <div key={item.key} className={`flex items-center justify-between gap-4 ${index !== arr.length - 1 ? 'border-b border-slate-800 pb-6' : ''}`}>
                  <div>
                    <h3 className="font-medium text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-400 max-w-md">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={formData.notifications[item.key]}
                      onChange={(e) => handleNestedChange('notifications', item.key, e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* Danger Zone */}
          <section id="danger" ref={el => sectionRefs.current['danger'] = el} className="bg-slate-900/50 border border-red-900/50 rounded-2xl p-6 scroll-mt-24">
            <div className="flex items-center gap-2 text-red-500 mb-6">
              <AlertTriangle className="w-5 h-5" />
              <h2 className="text-xl font-bold">Danger Zone</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-red-900/30 pb-6 mb-6">
              <div>
                <h3 className="font-bold text-white mb-1">Transfer Ownership</h3>
                <p className="text-sm text-slate-400">Transfer this organization's ownership to another member. You will become an Org Admin.</p>
              </div>
              <button 
                onClick={() => setIsTransferModalOpen(true)}
                className="shrink-0 px-5 py-2.5 bg-amber-600/10 hover:bg-amber-600 text-amber-500 hover:text-white font-semibold rounded-xl transition-colors"
              >
                Transfer Ownership
              </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h3 className="font-bold text-white mb-1">Delete Organization</h3>
                <p className="text-sm text-slate-400">Permanently remove this organization and all of its data. This action cannot be undone.</p>
              </div>
              <button 
                onClick={() => setIsDeleteModalOpen(true)}
                className="shrink-0 px-5 py-2.5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white font-semibold rounded-xl transition-colors"
              >
                Delete Organization
              </button>
            </div>
          </section>

        </div>
      </div>

      {/* Sticky Bottom Action Bar (Mobile & when dirty) */}
      <div className={`fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 p-4 transition-transform duration-300 z-40 flex items-center justify-between md:justify-center gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] ${
        isDirty ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <p className="hidden md:block text-slate-300 font-medium mr-4">You have unsaved changes</p>
        <button 
          onClick={handleReset}
          disabled={isSaving}
          className="px-5 py-2 text-slate-300 hover:bg-slate-800 font-medium rounded-lg transition-colors flex-1 md:flex-none"
        >
          Reset
        </button>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors shadow-lg flex-1 md:flex-none flex justify-center items-center gap-2"
        >
          {isSaving ? <CheckCircle2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
        </button>
      </div>

      {/* --- Modals --- */}
      
      {/* Reset Confirmation Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsResetModalOpen(false)}></div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Discard changes?</h3>
            <p className="text-sm text-slate-400 mb-6">Your unsaved changes will be lost and cannot be recovered.</p>
            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsResetModalOpen(false)}
                className="px-4 py-2 rounded-lg text-slate-300 font-medium hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmReset}
                className="px-5 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 text-red-500">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-lg font-bold">Delete organization?</h3>
              </div>
              <button onClick={() => setIsDeleteModalOpen(false)} className="text-slate-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-slate-300 mb-4">This action cannot be undone. All tournaments, members, and data associated with this organization will be permanently destroyed.</p>
            
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 mb-6">
              <p className="text-sm text-slate-400 mb-2">Type <span className="text-white font-bold select-all">{formData.general.name}</span> to confirm.</p>
              <input 
                type="text" 
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded focus:outline-none focus:border-red-500 px-3 py-2"
                placeholder={formData.general.name}
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg text-slate-300 font-medium hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                disabled={deleteConfirmText !== formData.general.name}
                onClick={handleDelete}
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:bg-slate-800 text-white font-medium transition-colors"
              >
                Delete Organization
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Ownership Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsTransferModalOpen(false)}></div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 text-amber-500">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-lg font-bold">Transfer Ownership</h3>
              </div>
              <button onClick={() => setIsTransferModalOpen(false)} className="text-slate-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-slate-300 mb-6">Select a member to transfer ownership to. They must accept the request before the transfer is complete.</p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-400 mb-2">New Owner</label>
              <select 
                value={transferUserId}
                onChange={(e) => setTransferUserId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                <option value="">Select a member...</option>
                {members.map(member => (
                  <option key={member.id} value={member.id}>{member.displayName} ({member.username})</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsTransferModalOpen(false)}
                className="px-4 py-2 rounded-lg text-slate-300 font-medium hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                disabled={!transferUserId || initiateOwnershipTransfer.isPending}
                onClick={handleTransferSubmit}
                className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-medium transition-colors"
              >
                {initiateOwnershipTransfer.isPending ? 'Sending Request...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
