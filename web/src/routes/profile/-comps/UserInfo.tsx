import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, MapPin } from 'lucide-react';

type UserInfoProps = {
  user: {
    firstName: string;
    lastName: string;
    username: string;
    mobile?: string;
    address?: string;
    type?: string;
    createdAt?: string;
  };
};

export function UserInfoCard({ user }: UserInfoProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl">User Information</CardTitle>
        <CardDescription>Your personal information and account details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">Full Name</p>
              <p className="text-base">
                {user.firstName} {user.lastName}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-base">{user.username}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">Mobile</p>
              <p className="text-base">{user.mobile}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">Address</p>
              <p className="text-base">{user.address}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-start gap-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Account Type</p>
              <p className="text-base capitalize">{user.type || 'regular'}</p>
            </div>
          </div>

          {user.createdAt && (
            <div className="flex items-start gap-3 mt-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Member Since</p>
                <p className="text-base">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
