import { useMutation, useQueryClient } from '@tanstack/react-query';
import { organizationService } from './organization.service';

export const useOrganizationMutations = () => {
  const queryClient = useQueryClient();

  const createOrganization = useMutation({
    mutationFn: (data) => organizationService.createOrganization(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });

  const updateOrganizationSettings = useMutation({
    mutationFn: ({ orgId, data }) => organizationService.updateOrganizationSettings(orgId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organizations', variables.orgId] });
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });

  const updateMemberRole = useMutation({
    mutationFn: ({ orgId, userId, role, customRoleName }) => organizationService.updateMemberRole(orgId, userId, role, customRoleName),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organizations', variables.orgId, 'members'] });
    },
  });

  const removeMember = useMutation({
    mutationFn: ({ orgId, userId }) => organizationService.removeMember(orgId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organizations', variables.orgId, 'members'] });
    },
  });

  const inviteUser = useMutation({
    mutationFn: ({ orgId, data }) => organizationService.inviteUser(orgId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organizations', variables.orgId, 'members'] });
    },
  });

  const createJoinLink = useMutation({
    mutationFn: ({ orgId, data }) => organizationService.createJoinLink(orgId, data),
    // Token is returned
  });

  const acceptInvite = useMutation({
    mutationFn: (token) => organizationService.acceptInvite(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });

  const acceptJoinLink = useMutation({
    mutationFn: (token) => organizationService.acceptJoinLink(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });

  const initiateOwnershipTransfer = useMutation({
    mutationFn: ({ orgId, toUserId }) => organizationService.initiateOwnershipTransfer(orgId, toUserId),
  });

  const acceptOwnershipTransfer = useMutation({
    mutationFn: ({ orgId, transferId }) => organizationService.acceptOwnershipTransfer(orgId, transferId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organizations', variables.orgId] });
      queryClient.invalidateQueries({ queryKey: ['organizations', variables.orgId, 'members'] });
    },
  });

  const cancelOwnershipTransfer = useMutation({
    mutationFn: ({ orgId, transferId }) => organizationService.cancelOwnershipTransfer(orgId, transferId),
  });

  const leaveOrganization = useMutation({
    mutationFn: (orgId) => organizationService.leaveOrganization(orgId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });

  const changePlan = useMutation({
    mutationFn: ({ orgId, planCode }) => organizationService.changePlan(orgId, planCode),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organizations', variables.orgId] });
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });

  const updateBrandKit = useMutation({
    mutationFn: ({ orgId, data }) => organizationService.updateBrandKit(orgId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organizations', variables.orgId] });
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });

  const uploadLogo = useMutation({
    mutationFn: ({ orgId, type, file }) => organizationService.uploadLogo(orgId, type, file),
  });

  return {
    createOrganization,
    updateOrganizationSettings,
    updateMemberRole,
    removeMember,
    inviteUser,
    createJoinLink,
    acceptInvite,
    acceptJoinLink,
    initiateOwnershipTransfer,
    acceptOwnershipTransfer,
    cancelOwnershipTransfer,
    leaveOrganization,
    changePlan,
    updateBrandKit,
    uploadLogo,
  };
};
