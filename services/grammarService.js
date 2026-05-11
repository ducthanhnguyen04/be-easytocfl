const { Grammars } = require("../models");

class GrammarService {
    async getAllGrammars() {
        try {
            const allGrammars = await Grammars.findAll();
            return allGrammars;
        } catch (error) {
            throw error;
        }  
    }
    async createGrammar(data) {
        try {
            const newGrammar = await Grammars.create(data);
            return newGrammar;
        } catch (error) {
            throw error;
        }
    }
    async updateGrammar(id, data) {
        try {
            const grammar = await Grammars.findByPk(id);
            if(!grammar) {
                return null;
            }
            await grammar.update(data);
            return grammar;
        } catch (error) {
            throw error;
        }
    }
    async deleteGrammar(id) {
        try {
            const deleted = await Grammars.destroy({ where: { id } });
            return deleted > 0; 
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new GrammarService();