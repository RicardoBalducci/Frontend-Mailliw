import { Box, Container, Fade } from "@mui/material"
import HeaderSection from "../../components/global/Header/header"
import { UserLock } from "lucide-react"

export function Personal () {
    return (
        <>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Fade in={true} timeout={800}>
                    <Box>
                         <HeaderSection
                            title="Lista de Personal"
                            icon={<UserLock />}
                            chipLabel={`1 Personal`}
                        />
                    </Box>
                </Fade>
            </Container>
        
        </>
    )
}
export default Personal