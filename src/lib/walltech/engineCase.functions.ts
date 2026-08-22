import { createServerFn } from "@tanstack/react-start";

import {
  createEngineCase,
  updateEngineCasePayload,
} from "./engineCaseStore.server";

import type {
  PropertyOpportunityInput,
} from "./propertyIntelligenceTypes";

export const createEnginePropertyCase = createServerFn({
  method: "POST",
})
  .validator(
    (data: {
      opportunity: PropertyOpportunityInput;
    }) => data,
  )
  .handler(async ({ data }) => {
    const created = await createEngineCase({
      jurisdictionCode: "IT",
      caseType: "PROPERTY",
      title: data.opportunity.title,
      payload: {},
    });

    const opportunity: PropertyOpportunityInput = {
      ...data.opportunity,
      opportunityId: created.id,
    };

    const persisted = await updateEngineCasePayload(
      created.id,
      {
        propertyOpportunity: opportunity,
      },
    );

    if (!persisted) {
      throw new Error(
        "Engine Case created but persistence update failed.",
      );
    }

    return {
      engineCase: persisted,
      opportunity,
    };
  });
