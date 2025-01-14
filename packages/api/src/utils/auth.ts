import { TRPCError } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { NodeHTTPRequest } from "@trpc/server/adapters/node-http";
import jwt from "jsonwebtoken";

import { env } from "@blobscan/env";

type NextHTTPRequest = CreateNextContextOptions["req"];

type HTTPRequest = NodeHTTPRequest | NextHTTPRequest;

export type APIClientType = "indexer" | "weavevm";

export type APIClient = {
  type: APIClientType;
};

function verifyIndexerClient(token: string) {
  const decoded = jwt.verify(token, env.SECRET_KEY) as string;

  return decoded;
}

function verifyWeaveVMClient(token: string) {
  return token === env.WEAVEVM_API_KEY;
}

export function retrieveAPIClient(req: HTTPRequest): APIClient | undefined {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return;
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return;
  }

  try {
    if (verifyWeaveVMClient(token)) {
      return { type: "weavevm" };
    }

    if (verifyIndexerClient(token)) {
      return { type: "indexer" };
    }
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return;
    }

    throw new TRPCError({ code: "BAD_REQUEST" });
  }
}
