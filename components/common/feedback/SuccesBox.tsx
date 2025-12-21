
interface SuccesBoxProps {
  message: string;
}

export default function SuccesBox({ message }: SuccesBoxProps) {
    if (!message) return null;
    return(
    <div className="my-2 p-3 text-smbg-green-50 border border-green-200 text-green-700 rounded-md text-center">
        {message}
    </div>
    );
}