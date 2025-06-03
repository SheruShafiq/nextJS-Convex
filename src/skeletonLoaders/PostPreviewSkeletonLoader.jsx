import React from "react";
import { Stack, Box, Skeleton } from "@mui/material";

function PostPreviewSkeletonLoader({ pageVariant }) {
  return (
    <Stack
      width="100%"
      px={pageVariant ? 0 : 2}
      py={2}
      className={pageVariant ? "" : "standardBorder"}
    >
      {pageVariant && (
        <Stack gap={0.5} mb={0.5}>
          <Stack direction={"row"} gap={1} alignItems={"center"}>
            <Skeleton
              animation="wave"
              variant="circular"
              width={14}
              height={14}
            ></Skeleton>
            <Skeleton animation="wave" variant="text" width={40} height={20} />
            <Skeleton animation="wave" variant="text" width={100} height={24} />
          </Stack>
          <Skeleton animation="wave" variant="text" width={300} height={36} />
        </Stack>
      )}
      <Stack gap={1}>
        {!pageVariant && (
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Skeleton
              animation="wave"
              variant="rounded"
              width="60%"
              height={"36px"}
            />

            <Skeleton
              animation="wave"
              variant="rounded"
              width={"15%"}
              height={20}
            />
          </Stack>
        )}
        <Skeleton
          animation="wave"
          variant="rounded"
          width={"40%"}
          height={20}
        />
        <Stack gap={1}>
          <Skeleton
            animation="wave"
            variant="rounded"
            width="100%"
            height={200}
          />
          <Skeleton
            animation="wave"
            variant="rounded"
            width="100%"
            height={50}
          />
          <Stack direction="row" spacing={3}>
            <Skeleton
              animation="wave"
              variant="rounded"
              width={35}
              height={25}
            />
            <Skeleton
              animation="wave"
              variant="rounded"
              width={35}
              height={25}
            />
            <Skeleton
              animation="wave"
              variant="rounded"
              width={35}
              height={25}
            />
            <Skeleton
              animation="wave"
              variant="rounded"
              width={60}
              height={25}
            />
            <Skeleton
              animation="wave"
              variant="rounded"
              width={40}
              height={25}
            />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default PostPreviewSkeletonLoader;
