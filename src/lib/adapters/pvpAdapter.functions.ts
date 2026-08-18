import { createServerFn } from "@tanstack/react-start";
import { probePvpHomepage } from "./pvpAdapter.server";
import { discoverPvpPublicSale } from "./pvpEvidenceAcquisition.server";
import { acquirePvpPublicDocument } from "./pvpDocumentAcquisition.server";

export const probePvp = createServerFn({
  method: "GET",
}).handler(async () => {
  return probePvpHomepage();
});

export const discoverPvpSale = createServerFn({
  method: "GET",
})
  .validator(
    (data: {
      announcementId: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    return discoverPvpPublicSale(
      data.announcementId,
    );
  });

export const acquirePvpDocument = createServerFn({
  method: "GET",
})
  .validator(
    (data: {
      announcementId: string;
      attachmentId: number;
    }) => data,
  )
  .handler(async ({ data }) => {
    return acquirePvpPublicDocument(
      data.announcementId,
      data.attachmentId,
    );
  });
