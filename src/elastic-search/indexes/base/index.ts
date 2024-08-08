export interface BaseDocument {
  id: string;
  indexed_at: Date;
  created_at: Date;
}

export interface BuildDocumentData {
  id: string;
}

export abstract class DocumentBuilder {
  public buildDocument(data: BuildDocumentData): BaseDocument {
    return {
      id: data.id,
      indexed_at: new Date(),
      created_at: new Date(),
    };
  }
}
