import MLink from "@mui/material/Link";
import { Box } from "@mui/material";

function Footer(props: Record<string, any>) {
  return (
    <Box flexDirection="row" display="flex" justifyContent="center" {...props}>
      <p>
        Copyright © 2022 - All right reserved by
        <MLink
          href="https://github.com/long2ice"
          target="_blank"
          rel="noreferrer"
          ml={1}
        >
          long2ice
        </MLink>
      </p>
    </Box>
  );
}

export default Footer;
