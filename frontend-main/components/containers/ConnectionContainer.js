import { Center, Container } from "native-base";

import Connections from "../lists/Connections";



const ConnectionContainer = () => {
  return (
    
    <Container flexDirection='column' alignItems='center' width='100%'  mt={5}>
      <Connections type={"Business"} width='100%' />
      <Connections type={"Medical"} width='100%'/>
      <Connections type={"Banking"} width='100%'/>
      <Connections type={"UX/UI Designer"} width='100%'/>
      <Connections type={"Developer"} width='100%'/>
      <Connections type={"Others"} width='100%'/>
    </Container>
    
  );
};

export default ConnectionContainer;
