import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserDTO } from "@/src/lib/dto"; // Assure-toi d'importer ton type
import { Mail, Phone } from "lucide-react";

interface UserProps {
    data: UserDTO[];
}

export default function UsersTableDesktop({ data }: UserProps) {
    return (
        <div className='overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hidden lg:block'>
            <Table>
                <TableHeader className="bg-gray-50/50">
                    <TableRow className="hover:bg-gray-50/50">
                        <TableHead className="w-[200px] font-semibold text-gray-700">Prénom</TableHead>
                        <TableHead className="w-[200px] font-semibold text-gray-700">Nom</TableHead>
                        <TableHead className="font-semibold text-gray-700">Contact</TableHead>
                        <TableHead className="w-[150px] font-semibold text-gray-700">Téléphone</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((user) => {
                         const email = "email" in user ? user.email : null;
                         const phone = "phone" in user ? user.phone : null;
                        return (
                            <TableRow key={user.id} className="group hover:bg-gray-50/50 transition-colors">

                                <TableCell className="py-4 font-medium text-gray-600">
                                    {user.name}
                                </TableCell>
                                <TableCell className="py-4 font-bold text-gray-900 uppercase text-sm">
                                    {user.lastname}
                                </TableCell>
                                <TableCell className="py-4">
                                    {email ? (
                                        <a 
                                            href={`mailto:${email}`} 
                                            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium"
                                        >
                                            {email}
                                            <Mail className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                                        </a>
                                    ) : (
                                        <span className="text-gray-400 italic">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="py-4">
                                    {phone ? (
                                        <a 
                                            href={`tel:${phone}`} 
                                            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                                        >
                                            {phone}
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}