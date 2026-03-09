import { Container } from "@/components/ui/Container";
import { Quote } from "@/components/ui/quote";
import { Title } from "@/components/ui/title";

export default function AboutPage() {


    return (
        <Container>
            <div className="space-y-2 mb-10">
                <Title>à propos de l'association</Title>
                <Quote>
                    Courir pour le plaisir, dans une ambiance conviviale à Avrillé.
                </Quote>
            </div>
        </Container>
    )
}