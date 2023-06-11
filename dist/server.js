"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
// create the server instance
const server = (0, fastify_1.default)({ logger: true });
server.register(cors_1.default, {
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
    ]);
});
// start the server
server.listen({ port: 3333 });
//# sourceMappingURL=server.js.map