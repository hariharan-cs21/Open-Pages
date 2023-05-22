import React from 'react'
import { auth, provider } from '../config/firebaseconfig'
import { signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { Icon, Button, Image, Card, Container } from 'semantic-ui-react'
const Login = ({ setloggedIn }) => {
    let navigate = useNavigate()
    const signIn = () => {
        signInWithPopup(auth, provider)
            .then((res) => {
                localStorage.setItem("isLogged", true)
                setloggedIn(true)
                navigate("/")
            })
    }
    return (
        <>
            <Container style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "80vh"
            }}>
                <Card className="card-container">
                    <Card.Content className="card-body">
                        <div className="google-btn">
                            <Button className="btn" onClick={signIn}>
                                <Icon name='google' /> Sign in with Google
                            </Button>
                            <Image className="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" height="30px" width="40px" alt="Sign in with Google" />
                        </div>
                    </Card.Content>
                </Card>
            </Container>
        </>
    )
}
export default Login

