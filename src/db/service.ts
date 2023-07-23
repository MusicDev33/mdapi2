import { Document, Model } from 'mongoose';

export class ModelService {
  
}

export class OldModelService<P extends Document> {
  private HelperClass: Model<P>;
  protected bannedParams: string[] = [];

  protected constructor(helperClass: Model<P>) {
    this.HelperClass = helperClass;
  }

  public async saveModel(newModel: P): Promise<P | null> {
    try {
      const savedModel = await newModel.save();
      return savedModel;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  // TODO: Make this actually useful
  public async saveChangedModel(changedModel: P, changedParam: string): Promise<string> {
    changedModel.markModified(changedParam);

    try {
      const savedModel = await changedModel.save();
      if (savedModel) {
        return 'Successfully changed parameter \'' + changedParam + '\'';
      }
      return `Couldn't change param '${changedParam}'`;
    } catch (err) {
      console.log(err);
      return 'Error - Insert error code here';
    }
  }

  // EXPERIMENTAL
  // TODO: Decide on whether I'm keeping this
  public async changeObject(id: string, attribute: string, newValue: any): Promise<P | null> {
    const object = await this.findOneModelByQuery({_id: id});

    // I really don't like this approach because in MongoDB, you can easily change schemas and if an object hasn't been
    // updated, then this will fail. Maybe I'll just have to be extra cautious about upgrade scripts...
    if (!object || attribute === '_id' || !(attribute in object)) {
      return null;
    }

    // Rolling with this, but wow it feels icky...
    if (typeof (object as { [key: string]: any })[attribute] === typeof newValue) {
      (object as { [key: string]: any })[attribute] = newValue;

      const savedObject = await this.saveChangedModel(object, attribute);

      if (!savedObject) {
        return null;
      }

      return object;
    }

    return null
  }

  public async findOneModelByParameter(param: string, paramValue: any): Promise<P | null> {
    if (this.bannedParams.includes(param)) {
      console.log(`Parameter '${param}' is banned!`);
      return null;
    }

    try {
      const query: any = {};
      query[param] = paramValue;
      const foundModel = await this.HelperClass.findOne(query).exec();
      return foundModel;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  public async findModelsByParameter(param: string, paramValue: any, sort: any = {_id: 1}, limit: number = 30): Promise<P[] | null> {
    if (this.bannedParams.includes(param)) {
      console.log(`Parameter '${param}' is banned!`);
      return null;
    }

    try {
      const query: any = {};
      query[param] = paramValue;
      const foundModels = await this.HelperClass.find(query).sort(sort).limit(limit).exec();
      return foundModels;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  public async findOneModelByQuery(query: any, sort: any = {_id: 1}, limit: number = 30): Promise<P | null> {
    try {
      const foundModel = await this.HelperClass.findOne(query).sort(sort).limit(limit).exec();
      return foundModel;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  public async findModelsByQuery(query: any, sort: any = {_id: 1}, limit: number = 30): Promise<P[] | null> {
    try {
      const foundModels = await this.HelperClass.find(query).sort(sort).limit(limit).exec();
      return foundModels;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  public async deleteModelsByQuery(query: any): Promise<boolean> {
    try {
      const deletedModels = await this.HelperClass.deleteMany(query).exec();
      return deletedModels ? true : false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  public async deleteAll(): Promise<boolean> {
    try {
      const deletedAllModels = await this.HelperClass.deleteMany({}).exec();
      return deletedAllModels ? true : false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
