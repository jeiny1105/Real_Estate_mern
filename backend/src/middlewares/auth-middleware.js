const { verifyAccessToken } = require("../utils/token-utils");
const agentRepository = require("../api/agents/agent-repository");
const AppError = require("../utils/app-error");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 🔥 NO TOKEN → allow (for public routes)
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyAccessToken(token);

    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    // 🔒 Agent checks (only if token exists)
    if (decoded.role === "Agent") {
      const agent = await agentRepository.findAgentByUserId(decoded.userId);

      if (!agent) {
        return next(new AppError("Agent profile not found", 403));
      }

      if (agent.status !== "Active") {
        return next(new AppError("Agent account not approved", 403));
      }
    }

    next();
  } catch (error) {
    // 🔥 IMPORTANT: DO NOT BLOCK PUBLIC ROUTES
    console.warn("Invalid/expired token ignored");

    next(); // ✅ allow request
  }
};

module.exports = authenticate;