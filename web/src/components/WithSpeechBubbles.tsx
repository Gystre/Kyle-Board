import {
    Avatar,
    Box,
    Container,
    Flex,
    Heading,
    Stack,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import { ReactNode } from "react";

const Testimonial = ({ children }: { children: ReactNode }) => {
    return <Box>{children}</Box>;
};

const TestimonialContent = ({ children }: { children: ReactNode }) => {
    return (
        <Stack
            bg={useColorModeValue("white", "gray.800")}
            boxShadow={"lg"}
            p={8}
            rounded={"xl"}
            align={"center"}
            pos={"relative"}
            _after={{
                content: `""`,
                w: 0,
                h: 0,
                borderLeft: "solid transparent",
                borderLeftWidth: 16,
                borderRight: "solid transparent",
                borderRightWidth: 16,
                borderTop: "solid",
                borderTopWidth: 16,
                borderTopColor: useColorModeValue("white", "gray.800"),
                pos: "absolute",
                bottom: "-16px",
                left: "50%",
                transform: "translateX(-50%)",
            }}
        >
            {children}
        </Stack>
    );
};

const TestimonialHeading = ({ children }: { children: ReactNode }) => {
    return (
        <Heading as={"h3"} fontSize={"xl"} textAlign="center">
            {children}
        </Heading>
    );
};

const TestimonialText = ({ children }: { children: ReactNode }) => {
    return (
        <Text
            textAlign={"center"}
            color={useColorModeValue("gray.600", "gray.400")}
            fontSize={"sm"}
        >
            {children}
        </Text>
    );
};

const TestimonialAvatar = ({
    src,
    name,
    title,
}: {
    src: string;
    name: string;
    title: string;
}) => {
    return (
        <Flex align={"center"} mt={8} direction={"column"}>
            <Avatar src={src} name={name} mb={2} />
            <Stack spacing={-1} align={"center"}>
                <Text fontWeight={600}>{name}</Text>
                <Text
                    fontSize={"sm"}
                    color={useColorModeValue("gray.600", "gray.400")}
                >
                    {title}
                </Text>
            </Stack>
        </Flex>
    );
};

export default function WithSpeechBubbles() {
    return (
        <Box>
            <Container py={16}>
                <Heading size="lg" mb={2}>
                    Not convinced?
                    <br />
                    Let our clients speak.
                </Heading>
                <Stack spacing={{ base: 10, md: 4, lg: 10 }}>
                    <Testimonial>
                        <TestimonialContent>
                            <TestimonialHeading>
                                Incredible Service
                            </TestimonialHeading>
                            <TestimonialText>
                                Please help me I was held at gunpoint to write
                                this review
                            </TestimonialText>
                        </TestimonialContent>
                        <TestimonialAvatar
                            src={
                                "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                            }
                            name={"Jane Cooper"}
                            title={"CEO at Ur Mom Corporation"}
                        />
                    </Testimonial>
                    <Testimonial>
                        <TestimonialContent>
                            <TestimonialHeading>
                                Can I get paid now
                            </TestimonialHeading>
                            <TestimonialText>
                                No seriously please pay me I have a wife and 4
                                kids on the brink of starvation
                            </TestimonialText>
                        </TestimonialContent>
                        <TestimonialAvatar
                            src={
                                "https://cdn.discordapp.com/attachments/200994742782132224/961818335677411358/unknown.png"
                            }
                            name={"Ben Dover"}
                            title={"CEO at Dietz Nuts Corporation"}
                        />
                    </Testimonial>
                    <Testimonial>
                        <TestimonialContent>
                            <TestimonialHeading>
                                Literally the greatest chat application to ever
                                exist
                            </TestimonialHeading>
                            <TestimonialText>
                                I love everything about this website, from the
                                ingenious color choice and design to the ultra
                                fast page loads and image uploading.
                            </TestimonialText>
                        </TestimonialContent>
                        <TestimonialAvatar
                            src={
                                "https://cdn.discordapp.com/attachments/200994742782132224/961819860717953084/IMG_6581.JPG"
                            }
                            name={"Kyle Yu (completely unbiased)"}
                            title={"Not the creator of Kyle Board"}
                        />
                    </Testimonial>
                </Stack>
            </Container>
        </Box>
    );
}
