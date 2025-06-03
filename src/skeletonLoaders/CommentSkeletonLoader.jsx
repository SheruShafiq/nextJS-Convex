import React from "react";
import { Stack, Skeleton, Avatar } from "@mui/material";

const CommentSkeletonLoader = () => {
  const randomLineCount = React.useMemo(
    () => Math.floor(Math.random() * (3 - 1 + 1)) + 1,
    []
  );
  return (
    <Stack width={"100%"} sx={{ position: "relative", ml: 0, pl: 0 }} gap={2}>
      <Stack direction="row" gap={2}>
        <Skeleton
          animation="wave"
          variant="circular"
          width={44}
          height={40}
        ></Skeleton>
        <Stack width={"100%"} gap={1}>
          <Stack gap={1} flexGrow={1}>
            <Skeleton animation="wave" variant="text" width={100} height={25} />
            <Stack>
              {Array.from({ length: randomLineCount }, (_, index) => (
                <Skeleton
                  animation="wave"
                  key={index}
                  variant="text"
                  width={`${Math.floor(Math.random() * (100 - 50 + 1)) + 50}%`}
                />
              ))}
            </Stack>
          </Stack>
          <Stack direction="row" gap={2}>
            <Skeleton
              animation="wave"
              variant="rounded"
              width={40}
              height={25}
            />
            <Skeleton
              animation="wave"
              variant="rounded"
              width={40}
              height={25}
            />
            <Skeleton
              animation="wave"
              variant="rounded"
              width={70}
              height={25}
            />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CommentSkeletonLoader;
