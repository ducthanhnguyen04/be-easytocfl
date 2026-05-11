const { Examples } = require("../models");

class ExampleService {
    async getAllExamples() {
        try {
            const allExamples = await Examples.findAll();
            return allExamples;
        } catch (error) {
            throw error;
        }  
    }
    async createExample(data) {
        try {
            const newExample = await Examples.create(data);
            return newExample;
        } catch (error) {
            throw error;
        }
    }
    async updateExample(id, data) {
        try {
            const example = await Examples.findByPk(id);
            if(!example) {
                return null;
            }
            await example.update(data);
            return example;
        } catch (error) {
            throw error;
        }
    }
    async deleteExample(id) {
        try {
            const deleted = await Examples.destroy({ where: { id } });
            return deleted > 0; 
        } catch (error) {
            throw error;
        }       
    }
}
module.exports = new ExampleService();