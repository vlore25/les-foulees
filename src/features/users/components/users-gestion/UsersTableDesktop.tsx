import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserRowActions } from "./UserRowActions";
import { UserStatusBadge } from "./UserStatusBadge";


interface UserProps {
    data: any;
}

export default function UsersTableDesktop({ data }: UserProps) {
    return (
        <div className='overflow-hidden rounded-md border'>
        <Table className="hidden lg:table">
            <TableHeader>
                <TableRow>
                    <TableHead>Prénom</TableHead>
                    <TableHead>Nom de famille</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead >Telephone</TableHead>
                    <TableHead >Status</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data?.map((item: any) => {
                   return (
                   <TableRow key={item.id}>
                        <TableCell >{item.name}</TableCell>
                        <TableCell>{item.lastname}</TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell >{item.phone}</TableCell>
                        <TableCell ><UserStatusBadge status={item.status}/></TableCell>
                        <TableCell ><UserRowActions userId={item.id}/></TableCell>
                    </TableRow>
                    )
                })}
            </TableBody>
        </Table>
        </div>
    );
}