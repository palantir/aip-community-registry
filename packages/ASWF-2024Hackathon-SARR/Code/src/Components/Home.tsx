import {Button, Card, Flex, TextField} from "@radix-ui/themes";
import {MagnifyingGlassIcon} from "@radix-ui/react-icons";
import {useNavigate} from "react-router-dom";

export const Home = () => {
    const navigate= useNavigate();
    return (
        <Card style={{
            minWidth: "100vw",
            position: "sticky",
            top: 0,
        }}>
            <Flex gap={"3"} justify={"between"}>
                <Button variant="ghost" onClick={() => navigate("/")}>
                    Home
                </Button>
                <TextField.Root placeholder="Search for stream..." style={{width:"33%"}}>
                    <TextField.Slot>
                        <MagnifyingGlassIcon height="16" width="16" />
                    </TextField.Slot>
                </TextField.Root>
                <Button variant="ghost" onClick={() => navigate("/reports")}>
                    Reports
                </Button>
            </Flex>
        </Card>
    )
}

