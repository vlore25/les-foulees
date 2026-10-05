import { Container } from "@/components/ui/Container";
import { Quote } from "@/components/ui/quote";
import { Title } from "@/components/ui/title";
import { membersBureau, membersCA } from "@/components/const/const";

export default function AboutPage() {



    return (
        <Container>
            <div className="space-y-2 mb-10">
                <Title>à propos de l'association</Title>
                <Quote>
                    Courir pour le plaisir, dans une ambiance conviviale à Avrillé.
                </Quote>
                <p>

                </p>

                <div className="space-y-6">
                    <div className="space-y-4 pt-4">
                        <h2 className="text-xl font-black uppercase tracking-tight text-primary italic border-b-2 border-primary/10 pb-2">
                            Membres du bureau
                        </h2>
                        {membersBureau.map((member) => {
                            return <>
                                <span className="text-muted-foreground leading-relaxed">
                                    {member.pos}
                                </span>
                                <p className="font-semibold leading-relaxed">
                                    {member.name}
                                </p>
                            </>
                        })}
                    </div>
                    <div className="space-y-4 pt-4">
                        <h2 className="text-xl font-black uppercase tracking-tight text-primary italic border-b-2 border-primary/10 pb-2">
                            Membres du conseil d'administration
                        </h2>
                        {membersCA.map((member) => {
                            return <>
                                <p className="font-semibold leading-relaxed">
                                    {member}
                                </p>
                            </>
                        })}
                    </div>
                </div>
            </div>
        </Container>
    )
}