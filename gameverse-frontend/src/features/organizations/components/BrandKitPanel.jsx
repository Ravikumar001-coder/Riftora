import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useOrganizationMutations } from '../api/useOrganizationMutations';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { BrandPreviewPanel } from './BrandPreviewPanel';

const brandKitSchema = z.object({
  logoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  secondaryLogoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color').optional().or(z.literal('')),
  secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color').optional().or(z.literal('')),
  accentColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color').optional().or(z.literal('')),
  primaryFont: z.string().max(100).optional().or(z.literal('')),
  secondaryFont: z.string().max(100).optional().or(z.literal('')),
  brandTagline: z.string().max(60, 'Max 60 characters').optional().or(z.literal('')),
});

const fonts = ['Inter', 'Roboto', 'Outfit', 'Open Sans', 'Lato', 'Montserrat', 'Poppins'];

export const BrandKitPanel = ({ organization }) => {
  const { updateBrandKit, uploadLogo } = useOrganizationMutations();
  const [uploadingPrimary, setUploadingPrimary] = useState(false);
  const [uploadingSecondary, setUploadingSecondary] = useState(false);

  const { register, handleSubmit, control, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(brandKitSchema),
    defaultValues: {
      logoUrl: organization?.logoUrl || '',
      secondaryLogoUrl: organization?.secondaryLogoUrl || '',
      primaryColor: organization?.primaryColor || '#071426',
      secondaryColor: organization?.secondaryColor || '#1e293b',
      accentColor: organization?.accentColor || '#2563EB',
      primaryFont: organization?.primaryFont || 'Inter',
      secondaryFont: organization?.secondaryFont || 'Roboto',
      brandTagline: organization?.brandTagline || '',
    },
  });

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'primary') setUploadingPrimary(true);
    else setUploadingSecondary(true);

    try {
      const res = await uploadLogo.mutateAsync({ orgId: organization.orgId, type, file });
      if (type === 'primary') {
        setValue('logoUrl', res.url, { shouldValidate: true });
        toast.success('Primary logo uploaded successfully');
      } else {
        setValue('secondaryLogoUrl', res.url, { shouldValidate: true });
        toast.success('Secondary logo uploaded successfully');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload logo');
    } finally {
      if (type === 'primary') setUploadingPrimary(false);
      else setUploadingSecondary(false);
    }
  };

  const onSubmit = (data) => {
    // Convert empty strings to null for optional URL/hex values
    const payload = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, v === '' ? null : v])
    );
    
    updateBrandKit.mutate({ orgId: organization.orgId, data: payload }, {
      onSuccess: () => {
        toast.success('Brand Kit updated successfully');
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Failed to update brand kit');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Brand Kit Configuration</h3>
        <p className="text-sm text-muted-foreground">
          Customize your organization's visual identity. Uploading PNGs will automatically convert them to WebP.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border p-4 rounded-lg bg-card">
          <div className="space-y-2">
            <Label>Primary Logo (PNG/SVG, min 400x400)</Label>
            <div className="flex gap-2">
              <Input type="file" accept="image/png, image/svg+xml, image/webp" onChange={(e) => handleFileUpload(e, 'primary')} className="flex-1" />
              {uploadingPrimary && <Loader2 className="w-6 h-6 animate-spin my-auto" />}
            </div>
            <Input {...register('logoUrl')} placeholder="Or enter URL directly" className="mt-2" />
            {errors.logoUrl && <p className="text-red-500 text-sm">{errors.logoUrl.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label>Secondary Logo / Wordmark</Label>
            <div className="flex gap-2">
              <Input type="file" accept="image/png, image/svg+xml, image/webp" onChange={(e) => handleFileUpload(e, 'secondary')} className="flex-1" />
              {uploadingSecondary && <Loader2 className="w-6 h-6 animate-spin my-auto" />}
            </div>
            <Input {...register('secondaryLogoUrl')} placeholder="Or enter URL directly" className="mt-2" />
            {errors.secondaryLogoUrl && <p className="text-red-500 text-sm">{errors.secondaryLogoUrl.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border p-4 rounded-lg bg-card">
          <div className="space-y-2">
            <Label>Primary Color</Label>
            <div className="flex gap-2">
              <Input type="color" {...register('primaryColor')} className="w-12 p-1 h-10" />
              <Input {...register('primaryColor')} placeholder="#000000" className="flex-1" />
            </div>
            {errors.primaryColor && <p className="text-red-500 text-sm">{errors.primaryColor.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Secondary Color</Label>
            <div className="flex gap-2">
              <Input type="color" {...register('secondaryColor')} className="w-12 p-1 h-10" />
              <Input {...register('secondaryColor')} placeholder="#000000" className="flex-1" />
            </div>
            {errors.secondaryColor && <p className="text-red-500 text-sm">{errors.secondaryColor.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Accent Color</Label>
            <div className="flex gap-2">
              <Input type="color" {...register('accentColor')} className="w-12 p-1 h-10" />
              <Input {...register('accentColor')} placeholder="#000000" className="flex-1" />
            </div>
            {errors.accentColor && <p className="text-red-500 text-sm">{errors.accentColor.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border p-4 rounded-lg bg-card">
          <div className="space-y-2">
            <Label>Primary Font</Label>
            <Controller
              name="primaryFont"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select primary font" />
                  </SelectTrigger>
                  <SelectContent>
                    {fonts.map(font => (
                      <SelectItem key={font} value={font}>{font}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Secondary Font</Label>
            <Controller
              name="secondaryFont"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select secondary font" />
                  </SelectTrigger>
                  <SelectContent>
                    {fonts.map(font => (
                      <SelectItem key={font} value={font}>{font}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="space-y-2 border p-4 rounded-lg bg-card">
          <Label>Brand Tagline</Label>
          <Input {...register('brandTagline')} placeholder="e.g. Elevating Esports" />
          {errors.brandTagline && <p className="text-red-500 text-sm">{errors.brandTagline.message}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting || updateBrandKit.isPending || uploadingPrimary || uploadingSecondary}>
          {updateBrandKit.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Brand Kit
        </Button>
      </form>

      {/* Live Preview Panel */}
      <BrandPreviewPanel values={watch()} />
    </div>
  );
};
