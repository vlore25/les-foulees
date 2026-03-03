import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Title } from "@/components/ui/title";

export default function TrainingSchedule() {

    const tableItems = [
        {
            day: "Mardi  et jeudi",
            hour: "18h30/20h00",
            place: "Parking du Stade Delaune"
        },
        {
            day: "Mercredi",
            hour: "8h45",
            place: "Parking de Netto à Avrillé"
        },
        {
            day: "Samedi",
            hour: "8h45/10h30",
            place: "Devant la Mairie d'Avrillé"
        },
    ];

    return (
        <section className="my-10 max-w-6xl mx-auto px-4 ">
            <Title >
                Nos séances d'entraînement :
            </Title>
            <Table className="text-lg">
                <TableCaption className="sm:text-sm text-md">Deux groupes le mardi selon le nombre de coureurs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="pl-0">Jour</TableHead>
                        <TableHead>Heure</TableHead>
                        <TableHead>Rendez-vous à</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>

                    {tableItems.map((itemRow) => {
                        return (
                            <TableRow key={itemRow.day} className="border-none ">
                                <TableCell className="font-medium pl-0">{itemRow.day}</TableCell>
                                <TableCell>{itemRow.hour}</TableCell>
                                <TableCell className="text-wrap">{itemRow.place}</TableCell>
                            </TableRow>
                        )
                    })}

                </TableBody>
            </Table>
        </section>
    );
}