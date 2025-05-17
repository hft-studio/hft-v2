import { Client } from "@upstash/qstash"
import type { NextRequest } from "next/server"

// Improve URL construction logic to be more robust
const getBaseUrl = () =>{
  return "http://localhost:3000";
};

const baseUrl = getBaseUrl();

// Custom JSON replacer function to handle BigInt values
const jsonReplacer = (key: string, value: unknown): unknown => {
  // Convert BigInt values to strings with a special prefix to identify them
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
};

// Define base types for workflow data
type WorkflowData = Record<string, unknown>;
type WorkflowResult = WorkflowData | Promise<WorkflowData>;

interface Step<I extends WorkflowData> {
  create: <O extends WorkflowData>(action: (prevResult: Awaited<I>) => O | Promise<O>) => Step<O>
  finally: (action: (prevResult: Awaited<I>) => void | Promise<void>) => void
}

export class Workflow {
  client = new Client({
    token: process.env.QSTASH_TOKEN ?? '',
  })

  steps: ((prevResult: WorkflowData) => WorkflowResult)[] = []

  createWorkflow = (setupStep: (step: Step<WorkflowData>) => void) => {
    const step: Step<WorkflowData> = {
      create: <O extends WorkflowData>(action: (prevResult: Awaited<WorkflowData>) => O | Promise<O>) => {
        this.steps.push(action as (prevResult: WorkflowData) => WorkflowResult)

        return step as Step<O>
      },
      finally: (action: (prevResult: Awaited<WorkflowData>) => void | Promise<void>) => {
        this.steps.push(action as unknown as (prevResult: WorkflowData) => WorkflowResult)
      },
    }

    setupStep(step)

    const POST = async (req: NextRequest) => {
      const { pathname } = new URL(req.url)

      const { searchParams } = new URL(req.url)
      const step = searchParams.get("step")

      const contentType = req.headers.get("content-type")

      if (contentType !== "application/json") {
        return new Response("Missing JSON request body.", { status: 405 })
      }

      let body: WorkflowData

      try {
        body = await req.json() as WorkflowData
      } catch (err) {
        body = {}
      }

      if (Number(step) > this.steps.length - 1) {
        return new Response("All tasks completed successfully")
      }

      if (step === null) {
        if (process.env.NODE_ENV === "development") {
          // Use full absolute URL in development mode
          try {
            const fullUrl = `${baseUrl}${pathname}?step=0`;
            await fetch(fullUrl, {
              method: "POST",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify(body, jsonReplacer),
            });
            return new Response("OK");
          } catch (err) {
            console.error("Development mode fetch error:", err);
            return new Response("Failed to start workflow in development mode", { status: 500 });
          }
        }
        
        try {
          await this.client.publish({
            url: `${baseUrl}${pathname}?step=0`,
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(body, jsonReplacer),
          })

          return new Response("OK")
        } catch (err) {
          console.error(err)
          return new Response("Failed to start workflow", { status: 500 })
        }
      }
      
      if (process.env.NODE_ENV === "development") {
        try {
          const action = this.steps[Number(step)]
          const res = await action(body)
  
          if (Number(step) < this.steps.length - 1) {
            const fullUrl = `${baseUrl}${pathname}?step=${Number(step) + 1}`;
            await fetch(fullUrl, {
              method: "POST",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify(res, jsonReplacer),
            });
          }
          
          return new Response("OK");
        } catch (err) {
          console.error("Development mode action error:", err);
          return new Response("Workflow error in development mode", { status: 500 });
        }
      }
      
      try {
        const action = this.steps[Number(step)]
        const res = await action(body)

        // call next step with function output
        if (Number(step) < this.steps.length - 1) {
          await this.client.publish({
            url: `${baseUrl}${pathname}?step=${Number(step) + 1}`,
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(res, jsonReplacer),
          })
        }

        return new Response("OK")
      } catch (err) {
        console.error(err)
        return new Response("Workflow error", { status: 500 })
      }
    }

    return { POST }
  }
}