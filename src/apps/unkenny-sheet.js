
import { findActorWithAlias } from "../scripts/chat-message-request.js";
import { getModelToTextMap } from "../scripts/models.js";
import { PREFIX_OPTIONS } from "../scripts/prefix.js";

class UnKennySheet extends DocumentSheet {
    constructor(actor) {
        super();
        this.context = {};
        this.object = actor;
    }

    get template() {
        return `modules/unkenny/apps/unkenny-sheet.hbs`;
    }

    async getData(options = {}) {
        if (Object.keys(this.context).length === 0) {
            this.context = await super.getData(options);
            this.context.resizable = true;
            this.initModels();
            this.initPrefixes();
            await this.initContextWithActorData();
        }

        return this.context;
    }

    initModels() {
        const modelsEntries = Object.entries(getModelToTextMap());
        let modelArray = modelsEntries.map(([model, text]) => ({ "model": model, "text": text }));
        modelArray.unshift({ "model": "", "text": "" });
        this.context.models = modelArray;
    }

    initPrefixes() {
        this.context.prefixes = Object.entries(PREFIX_OPTIONS).map(([key, value]) => ({ "key": key, "text": value }));
    }

    async initContextWithActorData() {
        this.context.alias = await this.object.getFlag("ai-pc-ollama", "alias") || "";
        this.context.preamble = await this.object.getFlag("ai-pc-ollama", "preamble") || "";

        let currentModel = await this.object.getFlag("ai-pc-ollama", "model");
        this.setContextModel(currentModel);

        this.context.minNewTokens = await this.object.getFlag("ai-pc-ollama", "minNewTokens");
        this.context.maxNewTokens = await this.object.getFlag("ai-pc-ollama", "maxNewTokens");
        this.context.repetitionPenalty = await this.object.getFlag("ai-pc-ollama", "repetitionPenalty");
        this.context.temperature = await this.object.getFlag("ai-pc-ollama", "temperature");

        let currentPrefix = await this.object.getFlag("ai-pc-ollama", "prefix") || "none";
        this.setContextPrefix(currentPrefix);
    }

    async _onChangeInput(event) {
        await super._onChangeInput(event);
        if (event.target.name == "model") {
            let model = event.target.value
            this.setContextModel(model);
        }
        if (event.target.name == "prefix") {
            let prefix = event.target.value;
            this.setContextPrefix(prefix);
        }
    }

    setContextModel(model) {
        this.context.models.forEach(m => {
            if (m.model == model) {
                m.isSelected = true;
            } else {
                m.isSelected = false;
            }
        });
    }

    setContextPrefix(prefix) {
        this.context.prefixes.forEach(p => {
            if (p.key == prefix) {
                p.isSelected = true;
            } else {
                p.isSelected = false;
            }
        });
    }

    async _updateObject(_event, formData) {
        await this.object.setFlag("ai-pc-ollama", "alias", formData.alias);
        await this.object.setFlag("ai-pc-ollama", "preamble", formData.preamble);
        await this.updateFlag(formData, "model");
        await this.updateFlag(formData, "minNewTokens");
        await this.updateFlag(formData, "maxNewTokens");
        await this.updateFlag(formData, "repetitionPenalty");
        await this.updateFlag(formData, "temperature");
        if (formData.prefix == "none") {
            await this.object.unsetFlag("ai-pc-ollama", "prefix");
        } else {
            await this.updateFlag(formData, "prefix");
        }

        const actor = await findActorWithAlias(formData.alias);
        if (!actor) {
            ui.notifications.error(game.i18n.localize("unkenny.sheet.settingAliasFailed"));
            return;
        }
    }

    async updateFlag(formData, key) {
        if (formData[key]) {
            await this.object.setFlag("ai-pc-ollama", key, formData[key]);
        } else {
            await this.object.unsetFlag("ai-pc-ollama", key);
        }
    }
}

export { UnKennySheet };