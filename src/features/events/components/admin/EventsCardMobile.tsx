import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface EventsProps {
    events: any;
}

export default function EventsCardMobile(events: EventsProps) {

    return (
        <div>
            {events.map((event: any) => {
                return (
                    <Card className='max-w-lg py-0 sm:flex-row sm:gap-0'>
                        <CardContent className='grow-1 px-0'>
                            <Image
                                src={event.imageUrlPath}
                                alt={event.title}
                                className='size-full rounded-l-xl'
                            />
                        </CardContent>
                        <div className='sm:min-w-54'>
                            <CardHeader className='pt-6'>
                                <CardTitle>{event.title}</CardTitle>
                                <CardDescription>{event.description}</CardDescription>
                            </CardHeader>
                            <CardFooter className='gap-3 py-6'>
                                <Button className='bg-transparent bg-gradient-to-br from-purple-500 to-pink-500 text-white focus-visible:ring-pink-600/20'>
                                    Explore More
                                </Button>
                            </CardFooter>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}