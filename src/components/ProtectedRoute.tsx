import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F4F6FA]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-[#003087] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[#8899AA] text-sm font-medium">Memuat...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    // For admin routes, check user metadata for admin role
    if (requireAdmin) {
        const role = user.user_metadata?.role;
        if (role !== 'admin') {
            return <Navigate to="/workspace" replace />;
        }
    }

    return <>{children}</>;
}
