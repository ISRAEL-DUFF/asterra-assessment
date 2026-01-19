import { useState, useMemo } from 'react';
import { useUsersWithHobbies, useDeleteUser, useDeleteHobby } from '@/hooks/useUsers';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { LoadingState } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { Trash2, Users, Sparkles, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { UserWithHobbies } from '@/types/user';

interface DeleteAction {
  type: 'user' | 'hobby';
  userId: number;
  hobby?: string;
}

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 25, 50];

export function UsersTable() {
  const { data: usersHobbies = [], isLoading, error } = useUsersWithHobbies();
  const deleteUser = useDeleteUser();
  const deleteHobby = useDeleteHobby();
  
  const [deleteAction, setDeleteAction] = useState<DeleteAction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hobbyFilter, setHobbyFilter] = useState<'all' | 'with-hobbies' | 'no-hobbies'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter and search logic
  const filteredData = useMemo(() => {
    let result = usersHobbies;

    // Apply hobby filter
    if (hobbyFilter === 'with-hobbies') {
      result = result.filter((row) => row.hobbies);
    } else if (hobbyFilter === 'no-hobbies') {
      result = result.filter((row) => !row.hobbies);
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((row) =>
        row.first_name?.toLowerCase().includes(query) ||
        row.last_name?.toLowerCase().includes(query) ||
        row.address?.toLowerCase().includes(query) ||
        row.phone_number?.toLowerCase().includes(query) ||
        row.hobbies?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [usersHobbies, searchQuery, hobbyFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Reset to first page when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: 'all' | 'with-hobbies' | 'no-hobbies') => {
    setHobbyFilter(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setHobbyFilter('all');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery.trim() !== '' || hobbyFilter !== 'all';

  const handleDeleteConfirm = async () => {
    if (!deleteAction) return;
    
    if (deleteAction.type === 'user') {
      await deleteUser.mutateAsync(deleteAction.userId);
    } else if (deleteAction.hobby) {
      await deleteHobby.mutateAsync({ 
        userId: deleteAction.userId, 
        hobby: deleteAction.hobby 
      });
    }
    
    setDeleteAction(null);
  };

  const getDeleteDialogContent = () => {
    if (!deleteAction) return { title: '', description: '' };
    
    if (deleteAction.type === 'user') {
      return {
        title: 'Delete User',
        description: 'Are you sure you want to delete this user? All their hobbies will also be deleted. This action cannot be undone.',
      };
    }
    
    return {
      title: 'Delete Hobby',
      description: `Are you sure you want to delete the hobby "${deleteAction.hobby}"? This action cannot be undone.`,
    };
  };

  if (isLoading) {
    return (
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <LoadingState message="Loading users and hobbies..." />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-card border-destructive">
        <CardContent className="pt-6">
          <EmptyState
            title="Error Loading Data"
            description="There was an error loading the users. Please try again later."
          />
        </CardContent>
      </Card>
    );
  }

  if (usersHobbies.length === 0) {
    return (
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <EmptyState
            icon={Users}
            title="No Users Found"
            description="Get started by adding your first user. You can then assign hobbies to them."
            actionLabel="Add User"
            actionHref="/forms"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="shadow-card animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent p-2">
                <Users className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <CardTitle>Users & Hobbies</CardTitle>
                <CardDescription>
                  {filteredData.length} of {usersHobbies.length} {usersHobbies.length === 1 ? 'record' : 'records'}
                </CardDescription>
              </div>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, address, phone, or hobby..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={hobbyFilter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by hobby" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Records</SelectItem>
                <SelectItem value="with-hobbies">With Hobbies</SelectItem>
                <SelectItem value="no-hobbies">No Hobbies</SelectItem>
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button variant="ghost" size="icon" onClick={clearFilters} className="shrink-0">
                <X className="h-4 w-4" />
                <span className="sr-only">Clear filters</span>
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {paginatedData.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No Results Found"
              description="Try adjusting your search or filter to find what you're looking for."
              actionLabel="Clear Filters"
              onAction={clearFilters}
            />
          ) : (
            <>
              <div className="rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-16">ID</TableHead>
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead className="hidden md:table-cell">Address</TableHead>
                        <TableHead className="hidden sm:table-cell">Phone</TableHead>
                        <TableHead>Hobby</TableHead>
                        <TableHead className="w-32 text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedData.map((row: UserWithHobbies, index: number) => (
                        <TableRow 
                          key={`${row.id}-${row.hobbies || 'no-hobby'}-${index}`}
                          className="animate-fade-in"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <TableCell className="font-medium">{row.id}</TableCell>
                          <TableCell>{row.first_name}</TableCell>
                          <TableCell>{row.last_name}</TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">
                            {row.address || '—'}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-muted-foreground">
                            {row.phone_number || '—'}
                          </TableCell>
                          <TableCell>
                            {row.hobbies ? (
                              <Badge variant="secondary" className="gap-1">
                                <Sparkles className="h-3 w-3" />
                                {row.hobbies}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">No hobbies</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => setDeleteAction({
                                type: row.hobbies ? 'hobby' : 'user',
                                userId: row.id,
                                hobby: row.hobbies,
                              })}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              {row.hobbies ? 'Hobby' : 'User'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Pagination Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Rows per page:</span>
                  <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
                    <SelectTrigger className="w-[70px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                        <SelectItem key={option} value={String(option)}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages || 1}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Previous page</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage >= totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">Next page</span>
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteAction}
        onOpenChange={(open) => !open && setDeleteAction(null)}
        title={getDeleteDialogContent().title}
        description={getDeleteDialogContent().description}
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
        isLoading={deleteUser.isPending || deleteHobby.isPending}
      />
    </>
  );
}
