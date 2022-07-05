import Head from "next/head";
import { Container, TextField } from "@mui/material";

function Index() {
  return (
    <Container>
      <Head>
        <title>Awesome - Search awesome Github projects</title>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover"
        />
      </Head>
      <TextField id="outlined-basic" label="Outlined" variant="outlined" />
      <TextField id="filled-basic" label="Filled" variant="filled" />
      <TextField id="standard-basic" label="Standard" variant="standard" />
    </Container>
  );
}

export default Index;
