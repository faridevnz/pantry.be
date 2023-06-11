import fastify from "fastify";
import cors from "@fastify/cors";

export type Food = {
  name: string;
  icon: string;
  expiration: string;
  category: string;
  quantity: {
    unit: string;
    value: string;
  };
};

// create the server instance
const server = fastify({ logger: true });
server.register(cors, {
  allowedHeaders: "*",
  methods: ["PUT", "POST", "DELETE", "GET", "OPTIONS"],
});

// register routes
server.get("/foods", (request, reply) => {
  reply.send([
    {
      name: "Broccoli Congelati",
      icon: "🥦",
      category: "VERDURA",
      expiration: "2023-06-12T15:39:12.726Z",
      quantity: { unit: "gr", value: "120" },
    },
    {
      name: "Avocado",
      icon: "🥑",
      category: "VERDURA",
      expiration: "2023-06-13T15:39:12.726Z",
      quantity: { unit: "gr", value: "60" },
    },
    {
      name: "Bistecchine di Vitello",
      icon: "🥩",
      category: "CARNE",
      expiration: "2023-06-14T15:39:12.726Z",
      quantity: { unit: "gr", value: "230" },
    },
    {
      name: "Sovraccosce di Pollo",
      icon: "🍗",
      category: "CARNE",
      expiration: "2023-06-10T15:39:12.726Z",
      quantity: { unit: "gr", value: "440" },
    },
    {
      name: "Mele rosse Fuji",
      icon: "🍎",
      category: "FRUTTA",
      expiration: "2023-06-11T15:39:12.726Z",
      quantity: { unit: "pz", value: "3" },
    },
    {
      name: "Pere",
      icon: "🍐",
      category: "FRUTTA",
      expiration: "2023-06-20T15:39:12.726Z",
      quantity: { unit: "pz", value: "1" },
    },
  ] satisfies Food[]);
});

// start the server
server.listen({ port: 3333, host: "0.0.0.0" });
