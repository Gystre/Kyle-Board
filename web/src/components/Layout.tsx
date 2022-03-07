import { Navbar } from "./Navbar";
import { WrapperVariant, Wrapper } from "./Wrapper";

interface Props {
    variant?: WrapperVariant;
}
export const Layout: React.FC<Props> = ({ children, variant }) => {
    return (
        <>
            <Navbar />
            <Wrapper variant={variant}>{children}</Wrapper>
        </>
    );
};
