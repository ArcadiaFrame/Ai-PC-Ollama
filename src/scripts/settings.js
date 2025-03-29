import { getModelToTextMap } from "./models.js";
import { PREFIX_OPTIONS } from "./prefix.js";

function llmParametersAndDefaults() {
    return {
        model: null,
        apiKey: "",
        ollamaHost: "http://localhost:11434",
        minNewTokens: 1,
        maxNewTokens: 250,
        repetitionPenalty: 0.0,
        temperature: 1.0,
        prefix: ""
    };
}

function registerGameParameters() {
    const params = llmParametersAndDefaults();

    game.settings.register("ai-pc-ollama", "model", {
        name: game.i18n.localize("unkenny.settings.model"),
        hint: game.i18n.localize("unkenny.settings.modelDescription"),
        scope: "world",
        config: true,
        type: String,
        choices: getModelToTextMap(),
        default: params.model
    });

    game.settings.register("ai-pc-ollama", "apiKey", {
        name: game.i18n.localize("unkenny.settings.apiKey"),
        hint: game.i18n.localize("unkenny.settings.apiKeyDescription"),
        scope: "world",
        config: true,
        type: String,
        default: params.apiKey
    });

    game.settings.register("ai-pc-ollama", "ollamaHost", {
        name: "Ollama Host URL",
        hint: "The URL where your Ollama instance is running (e.g., http://localhost:11434). Required for using Ollama models.",
        scope: "world",
        config: true,
        type: String,
        default: params.ollamaHost
    });

    game.settings.register("ai-pc-ollama", "minNewTokens", {
        name: game.i18n.localize("unkenny.settings.minNewTokens"),
        hint: game.i18n.localize("unkenny.settings.minNewTokensDescription"),
        scope: "world",
        config: true,
        type: Number,
        range: {
            min: 1,
            max: 100,
            step: 1
        },
        default: params.minNewTokens
    });

    game.settings.register("ai-pc-ollama", "maxNewTokens", {
        name: game.i18n.localize("unkenny.settings.maxNewTokens"),
        hint: game.i18n.localize("unkenny.settings.maxNewTokensDescription"),
        scope: "world",
        config: true,
        type: Number,
        range: {
            min: 1,
            max: 1000,
            step: 1
        },
        default: params.maxNewTokens
    });

    game.settings.register("ai-pc-ollama", "repetitionPenalty", {
        name: game.i18n.localize("unkenny.settings.repetitionPenalty"),
        hint: game.i18n.localize("unkenny.settings.repetitionPenaltyDescription"),
        scope: "world",
        config: true,
        type: Number,
        range: {
            min: -2.0,
            max: 2.0,
            step: 0.01
        },
        default: params.repetitionPenalty
    });

    game.settings.register("ai-pc-ollama", "temperature", {
        name: game.i18n.localize("unkenny.settings.temperature"),
        hint: game.i18n.localize("unkenny.settings.temperatureDescription"),
        scope: "world",
        config: true,
        type: Number,
        range: {
            min: 0,
            max: 2,
            step: 0.01
        },
        default: params.temperature
    });

    game.settings.register("ai-pc-ollama", "prefix", {
        name: game.i18n.localize("unkenny.settings.prefix"),
        hint: game.i18n.localize("unkenny.settings.prefixDescription"),
        scope: "world",
        config: true,
        type: String,
        choices: PREFIX_OPTIONS,
        default: params.prefix
    });
}

export { llmParametersAndDefaults, registerGameParameters };
