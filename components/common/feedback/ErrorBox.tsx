

interface ErrorBoxProps {
  error: string;
}

export default function ErrorBox({ error }: ErrorBoxProps) {
    if (!error) return null;
    return(
    <div className="my-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md text-center">
        {error}
    </div>
    );
}