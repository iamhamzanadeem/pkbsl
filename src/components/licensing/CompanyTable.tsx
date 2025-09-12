import { Company } from '@/types/licensing';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building2, Mail, Phone, Calendar, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface CompanyTableProps {
  companies: Company[];
  onViewCompany?: (company: Company) => void;
  onEditCompany?: (company: Company) => void;
  onCreateLicense?: (company: Company) => void;
  onViewLicense?: (company: Company) => void;
}

export function CompanyTable({ 
  companies, 
  onViewCompany, 
  onEditCompany, 
  onCreateLicense, 
  onViewLicense 
}: CompanyTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'trial': return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'inactive': return 'bg-red-500/10 text-red-700 border-red-500/20';
      case 'suspended': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'prospect': return 'bg-purple-500/10 text-purple-700 border-purple-500/20';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const getSizeColor = (size: string) => {
    switch (size) {
      case 'enterprise': return 'bg-purple-500/10 text-purple-700';
      case 'large': return 'bg-blue-500/10 text-blue-700';
      case 'medium': return 'bg-green-500/10 text-green-700';
      case 'small': return 'bg-yellow-500/10 text-yellow-700';
      case 'startup': return 'bg-orange-500/10 text-orange-700';
      default: return 'bg-gray-500/10 text-gray-700';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>License</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-medium">{company.name}</div>
                    <div className="text-sm text-muted-foreground">{company.address.city}, {company.address.country}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-3 w-3" />
                    {company.contactEmail}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {company.phone || 'N/A'}
                  </div>
                </div>
              </TableCell>
              <TableCell>{company.industry}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getSizeColor(company.size)}>
                  {company.size}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(company.status)}>
                  {company.status}
                </Badge>
              </TableCell>
              <TableCell>
                {company.license ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewLicense?.(company)}
                  >
                    View License
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onCreateLicense?.(company)}
                  >
                    Create License
                  </Button>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(company.createdAt).toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewCompany?.(company)}>
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEditCompany?.(company)}>
                      Edit Company
                    </DropdownMenuItem>
                    {!company.license && (
                      <DropdownMenuItem onClick={() => onCreateLicense?.(company)}>
                        Create License
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}