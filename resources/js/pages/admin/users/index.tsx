import { AlertDialogHeader } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@radix-ui/react-alert-dialog';
import { CheckCircle2, ChevronLeft, ChevronRight, Pencil, Plus, Search, Trash2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface User {
    id: number;
    name: string;
    user_role: string;
    email: string;
}

interface UserRole {
    id: number;
    name: string;
}

interface Props {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search: string;
        filter: string;
    };
    userRoles: UserRole[];
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employees',
        href: '/admin/users',
    },
];

export default function Index({ users, flash, userRoles, filters }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<'success' | 'error' | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [roleFilter, setRoleFilter] = useState<string>(filters.filter || 'all');

    const {
        data,
        setData,
        post,
        put,
        processing,
        reset,
        delete: destroy,
    } = useForm({
        name: '',
        email: '',
        password: '',
        user_role: '',
    });
    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
            setToastType('success');
            setShowToast(true);
        } else if (flash?.error) {
            setToastMessage(flash.error);
            setToastType('error');
            setShowToast(true);
        }
    }, [flash]);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
        if (editingUser) {
            setData({
                name: editingUser.name,
                email: editingUser.email,
                user_role: editingUser.user_role,
                password: '',
            });
        } else {
            reset();
        }
    }, [showToast, editingUser, reset, setData]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Submitting form data:', data); // Add this line

        if (editingUser) {
            put(route('users.update', editingUser.id), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                    setEditingUser(null);
                },
            });
        } else {
            post(route('users.store'), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
                onError: (errors) => {
                    console.log('Errors:', errors); // Log any validation errors
                },
            });
        }
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log('Search parameters:', {
            search: searchTerm,
            filter: roleFilter,
        });

        router.get(
            route('users.index'),
            {
                search: searchTerm,
                filter: roleFilter,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    console.log('Search results:', users);
                },
                onError: (errors) => {
                    console.error('Search error:', errors);
                },
            },
        );
    };

    const handleDelete = (id: number) => {
        destroy(route('users.destroy', id), {
            method: 'delete', // Explicitly set the method
            preserveScroll: true,
            onSuccess: () => {
                setToastMessage('User deleted successfully');
                setToastType('success');
                setShowToast(true);
                // Optionally refresh the user list
                router.reload();
            },
            onError: (errors) => {
                setToastMessage('Failed to delete user');
                setToastType('error');
                setShowToast(true);
                console.error('Delete error:', errors);
            },
        });
    };

    const handlePageChange = (page: number) => {
        router.get(
            route('users.index'),
            {
                page,
                search: searchTerm,
                filter: roleFilter,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="from-background to-muted/20 flex h-full flex-1 flex-col gap-6 rounded-xl bg-gradient-to-br p-6">
                {showToast && (
                    <div
                        className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg p-4 shadow-lg ${
                            toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
                        } animate-in fade-in slide-in-from-top-5 text-white`}
                    >
                        {toastType === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                        <span>{toastMessage}</span>{' '}
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Employees</h1>{' '}
                        <p className="text-muted-foreground mt-1">Manage your Employees and stay organized</p>{' '}
                    </div>{' '}
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger>
                            <Button className="bg-primary hover:bg-primary/90 shadow-lg">
                                <Plus className="mr-2 h-4 w-4" />
                                New User
                            </Button>{' '}
                        </DialogTrigger>{' '}
                        <DialogContent className="position-absolute top-1/8 left-1/3 w-full">
                            <DialogHeader>
                                <DialogTitle className="text-xl">{editingUser ? 'Edit User' : 'Create New User'}</DialogTitle>{' '}
                            </DialogHeader>{' '}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">name</Label>{' '}
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        className="focus:ring-primary focus:ring-2"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="block text-sm font-medium">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        className="focus:ring-primary focus:ring-2"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="user_role">User Role</Label>{' '}
                                    <Select value={data.user_role} onValueChange={(value) => setData('user_role', value)}>
                                        <SelectTrigger className="focus:ring-primary focus:ring-2">
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>{' '}
                                        <SelectContent>
                                            {userRoles.map((role) => (
                                                <SelectItem key={role.name} value={role.name.toString()}>
                                                    {role.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>{' '}
                                    </Select>{' '}
                                </div>{' '}
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-primary hover:bg-primary/90 text-secondary w-full shadow-lg"
                                >
                                    {editingUser ? 'Update' : 'Create'} User
                                </Button>
                            </form>
                        </DialogContent>{' '}
                    </Dialog>{' '}
                </div>
                <div className="mb-4 flex gap-4">
                    <form onSubmit={handleSearch} className="relative flex-1">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                        <Input placeholder="Search users ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                    </form>{' '}
                    <Select
                        value={roleFilter}
                        onValueChange={(value) => {
                            setRoleFilter(value);
                            router.get(route('users.index'), { search: searchTerm, filter: value }, { preserveState: true, preserveScroll: true });
                        }}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by role">
                                {roleFilter === 'all'
                                    ? 'All Roles'
                                    : userRoles.find((role) => role.name.toLowerCase() === roleFilter)?.name || roleFilter}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            {userRoles.map((role) => (
                                <SelectItem key={role.name} value={role.name.toLowerCase()}>
                                    {role.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                                    <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">ID</th>
                                    <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">Name</th>
                                    <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">Role</th>
                                    <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">Email</th>{' '}
                                    <th className="text-muted-foreground h-12 px-4 text-right align-middle font-medium">Actions</th>{' '}
                                </tr>{' '}
                            </thead>{' '}
                            <tbody className="[&_tr:last-child]:border-0">
                                {users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                                        <td className="p-4 align-middle font-medium">{user.id}</td>
                                        <td className="max-w-[200px] truncate p-4 align-middle">{user.name || 'No name'}</td>
                                        <td className="max-w-[200px] truncate p-4 align-middle">{user.user_role || 'No Role'}</td>

                                        <td className="p-4 align-middle">{user.email || 'No email'}</td>

                                        <td className="p-4 text-right align-middle">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setEditingUser(user);
                                                        setIsOpen(true);
                                                    }}
                                                    className="hover:bg-primary/10 hover:text-primary"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/90">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>

                                                    <AlertDialogContent className="fixed inset-0 z-30 flex items-center justify-center bg-black/80">
                                                        <div className="bg-secondary mx-auto w-full max-w-md rounded-lg p-6 shadow-lg">
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle className="text-primary mb-4 text-lg font-semibold">
                                                                    Confirm Delete
                                                                </AlertDialogTitle>
                                                            </AlertDialogHeader>

                                                            <p className="text-primary mb-6 text-sm">
                                                                Are you sure you want to delete this list? This action cannot be undone.
                                                            </p>

                                                            <div className="flex justify-end space-x-3">
                                                                <AlertDialogCancel className="bg-primary text-secondary rounded border-green-700 px-4 py-2 hover:bg-green-700 hover:text-white">
                                                                    Cancel
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(user.id)}
                                                                    className="bg-primary text-secondary rounded border border-red-700 px-4 py-2 hover:bg-red-700 hover:text-white"
                                                                >
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </div>
                                                        </div>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {users.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-muted-foreground p-4 text-center">
                                            No users found{' '}
                                        </td>
                                    </tr>
                                )}
                            </tbody>{' '}
                        </table>{' '}
                    </div>{' '}
                </div>
                {/* Pagination */}
                <div className="flex items-center justify-between px-2">
                    <div className="text-muted-foreground text-sm">
                        Showing {users.from} to {users.to} of {users.total} results
                    </div>{' '}
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(users.current_page - 1)}
                            disabled={users.current_page === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>{' '}
                        <div className="flex items-center space-x-1">
                            {Array.from({ length: users.last_page }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={page === users.current_page ? 'default' : 'outline'}
                                    size="icon"
                                    onClick={() => handlePageChange(page)}
                                ></Button>
                            ))}
                        </div>{' '}
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(users.current_page + 1)}
                            disabled={users.current_page === users.last_page}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>{' '}
                    </div>{' '}
                </div>{' '}
            </div>{' '}
        </AppLayout>
    );
}
