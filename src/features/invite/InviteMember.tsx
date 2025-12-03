import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { MailIcon } from "lucide-react";

export default function InviteMember() {
    return (
        <div>
            <h2>Inviter un nouveau membre</h2>
            <p>La personne recevra un lien unique dans boite email, ou il devras saisir ses information</p>
        <InputGroup>
            <InputGroupInput type="email" placeholder="Enter your email" />
            <InputGroupAddon>
                <MailIcon />
            </InputGroupAddon>
        </InputGroup>
        </div>
    );
}