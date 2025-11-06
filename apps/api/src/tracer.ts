import tracer from "dd-trace";

tracer.init({
  service: process.env.DD_SERVICE || "conduit-api",
  env: process.env.DD_ENV || process.env.NODE_ENV || "development",
  version: process.env.DD_VERSION || "1.0.0",
  logInjection: true,
  profiling: process.env.DD_PROFILING_ENABLED === "true",
  runtimeMetrics: true,
  tags: {
    app: "conduit",
    component: "api",
  },
});

export default tracer;