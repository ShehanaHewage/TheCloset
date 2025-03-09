import { createFileRoute } from '@tanstack/react-router';
import { useUserStore } from '@/stores/userStore';
import { UpdateProfileDto, ChangePasswordDto } from '@/models/user';
import { UserInfoCard } from './-comps/UserInfo';
import { UserDetailsForm } from './-comps/UserDetailsForm';
import { ChangePasswordForm } from './-comps/ChangePasswordForm';
import { Page } from '@/components/common/Page';
import { useMutation } from '@tanstack/react-query';
import api from '@/api/api';
import { toast } from 'sonner';

export const Route = createFileRoute('/profile/')({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, setUser } = useUserStore();

  const { mutate: updateProfile } = useMutation({
    mutationFn: async (data: UpdateProfileDto) => {
      return await api.users.updateProfile(data);
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Update failed');
    },
  });

  const { mutate: changePassword } = useMutation({
    mutationFn: async (data: ChangePasswordDto) => {
      return await api.users.changePassword(data);
    },
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Password change failed');
    },
  });

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Page
      title="My Profile"
      description="Manage your account information and preferences"
      containerClassName="max-w-6xl mx-auto my-10"
    >
      <UserInfoCard user={user} />
      <UserDetailsForm
        user={user}
        onSubmit={(data) => {
          updateProfile(data);
        }}
      />
      <ChangePasswordForm
        onSubmit={(data) => {
          changePassword(data);
        }}
      />
    </Page>
  );
}
