import { IEntityCommerceProduct } from '@/types/ecommerce/IEntityCommerceProduct';
import { IEntityCommerceUser } from '@/types/ecommerce/IEntityCommerceUser';
import { IEntityCommerceUserEvent } from '@/types/ecommerce/IEntityCommerceUserEvent';
import { AnyBulkWriteOperation } from 'mongodb';
import EntityCommerceProductService from '../ecommerce/EntityCommerceProductService';
import EntityCommerceUserEventService from '../ecommerce/EntityCommerceUserEventService';
import EntityCommerceUserService from '../ecommerce/EntityCommerceUserService';

interface IModelCommerceEventTotals {
  numSessions: number;
  numProductViews: number;
  numCheckouts: number;
  numPurchases: number;
}

const commerceUserService = new EntityCommerceUserService();
const commerceProductService = new EntityCommerceProductService();
const commerceUserEventService = new EntityCommerceUserEventService();

const CONFIG = {
  maxNumSessions: 2000,
  minNumSessions: 1000,
  minFunnelStepConversion: 0.25,
};

export class SeedDataService {
  public static getService(): SeedDataService {
    return new SeedDataService();
  }

  public async genHasSeedData(): Promise<boolean> {
    const [user, product, commerceEvent] = await Promise.all([
      commerceUserService.genSampleOne(),
      commerceProductService.genSampleOne(),
      commerceUserEventService.genSampleOne(),
    ]);

    return user != null && product != null && commerceEvent != null;
  }

  public async genDeleteSeedData(): Promise<void> {
    console.log('\n_____DELETING SEED DATA_____');
    await Promise.all([
      commerceUserService.genDeleteAllEntities(),
      commerceProductService.genDeleteAllEntities(),
      commerceUserEventService.genDeleteAllEntities(),
    ]);
    console.log('_____SEED DATA DELETED_____');
  }

  /**
   * Determine arbitrary numbers of events, with each
   * preceding event being the ceiling for the next:
   *      - session events
   *      - product view events
   *      - check out events
   *      - purchase event
   *
   * Generate an arbitrary number of products.
   *
   * Generate an arbitrary number of users.
   *
   * Generate all events. For product-view and purchase
   * events, fetch a random product. For all events, fetch
   * a random user.
   */
  public async genWriteSeedData(): Promise<void> {
    console.log('\n_____SEEDING DATA INIT_____');
    const seedTotals = this.getEventTotals();
    // gen dependencies first (users and products)
    await Promise.all([this.genSeedUsers(), this.genSeedProducts()]);
    // gen events
    await Promise.all([
      this.genSeedSessionEvents(seedTotals.numSessions),
      this.genSeedProductViewEvents(seedTotals.numProductViews),
      this.genSeedCheckoutEvents(seedTotals.numCheckouts),
      this.genSeedPurchaseEvents(seedTotals.numPurchases),
    ]);
    console.log('_____SEEDING DATA COMPLETE_____');
  }

  private getEventTotals(): IModelCommerceEventTotals {
    const sessionsMinMaxDelta = CONFIG.maxNumSessions - CONFIG.minNumSessions;
    const numSessions =
      Math.ceil(Math.random() * sessionsMinMaxDelta) + CONFIG.minNumSessions;

    const numProductViews = Math.max(
      Math.ceil(numSessions * Math.random()),
      Math.ceil(numSessions * CONFIG.minFunnelStepConversion)
    );

    const numCheckouts = Math.max(
      Math.ceil(numProductViews * Math.random()),
      Math.ceil(numProductViews * CONFIG.minFunnelStepConversion)
    );

    const numPurchases = Math.max(
      Math.ceil(numCheckouts * Math.random()),
      Math.ceil(numCheckouts * CONFIG.minFunnelStepConversion)
    );

    return {
      numSessions,
      numProductViews,
      numCheckouts,
      numPurchases,
    };
  }

  private async genSeedProducts(): Promise<void> {
    console.log('---Seeding products---');

    const totalProducts = Math.ceil(Math.random() * 50) + 50;
    const productPayloadPromises = Array.from({ length: totalProducts }).map(
      () => this.genSingleProductPayload()
    );
    const productPayloads = await Promise.all(productPayloadPromises);
    const bulkWritePayloads: AnyBulkWriteOperation<IEntityCommerceProduct>[] =
      productPayloads
        .filter((product): product is IEntityCommerceProduct => product != null)
        .map((document) => {
          return {
            insertOne: {
              document,
            },
          };
        });

    const bulkOp = await commerceProductService.genBulkWrite(bulkWritePayloads);
    console.log(`
            ---Products seed complete---
            Total attempts: ${productPayloads.length}.
            Total success: ${bulkOp.insertedCount}.
            Total error: ${productPayloads.length - bulkOp.insertedCount}.
        `);
  }

  private async genSingleProductPayload(): Promise<IEntityCommerceProduct | null> {
    try {
      const priceWhole = Math.ceil(Math.random() * 450) + 50;
      const priceCents = +Math.random().toFixed(2);
      const product: IEntityCommerceProduct = {
        _id: EntityCommerceUserService.getObjectId(),
        currency: 'USD',
        price: priceWhole + priceCents,
      };
      return product;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  private async genSeedUsers(): Promise<void> {
    console.log('---Seeding users---');

    const totalUsers = Math.ceil(Math.random() * 50) + 50;
    const userPayloadPromises = Array.from({ length: totalUsers }).map(() =>
      this.genSingleUserPayload()
    );
    const userPayloads = await Promise.all(userPayloadPromises);
    const bulkWritePayloads: AnyBulkWriteOperation<IEntityCommerceUser>[] =
      userPayloads
        .filter((user): user is IEntityCommerceUser => user != null)
        .map((user) => {
          return {
            insertOne: {
              document: user,
            },
          };
        });

    const bulkOp = await commerceUserService.genBulkWrite(bulkWritePayloads);
    console.log(`
            ---Users seed complete---
            Total attempts: ${userPayloads.length}.
            Total success: ${bulkOp.insertedCount}.
            Total error: ${userPayloads.length - bulkOp.insertedCount}.
        `);
  }

  private async genSingleUserPayload(): Promise<IEntityCommerceUser | null> {
    try {
      return {
        _id: EntityCommerceUserService.getObjectId(),
      };
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  private async genSeedSessionEvents(numEvents: number): Promise<void> {
    console.log('---Seeding session events---');

    const sessionPayloadPromises = Array.from({ length: numEvents }).map(() =>
      this.genSingleSessionEventPayload()
    );
    const sessionPayloads = await Promise.all(sessionPayloadPromises);
    const bulkWritePayloads: AnyBulkWriteOperation<IEntityCommerceUserEvent>[] =
      sessionPayloads
        .filter(
          (sessionEvent): sessionEvent is IEntityCommerceUserEvent =>
            sessionEvent != null
        )
        .map((sessionEvent) => {
          return {
            insertOne: {
              document: sessionEvent,
            },
          };
        });

    const bulkOp =
      await commerceUserEventService.genBulkWrite(bulkWritePayloads);
    console.log(`
            ---Session events seed complete---
            Total attempts: ${sessionPayloads.length}.
            Total success: ${bulkOp.insertedCount}.
            Total error: ${sessionPayloads.length - bulkOp.insertedCount}.
        `);
  }

  private async genSingleSessionEventPayload(): Promise<IEntityCommerceUserEvent | null> {
    const user = await this.genSampleUser();
    return {
      _id: EntityCommerceUserService.getObjectId(),
      date: new Date(),
      event_type: 'session',
      user_id: user._id,
      commerce_reference_id: null,
    };
  }

  private async genSeedProductViewEvents(numEvents: number): Promise<void> {
    console.log('---Seeding product-view events---');

    const sessionPayloadPromises = Array.from({ length: numEvents }).map(() =>
      this.genSingleProductViewEventPayload()
    );
    const sessionPayloads = await Promise.all(sessionPayloadPromises);
    const bulkWritePayloads: AnyBulkWriteOperation<IEntityCommerceUserEvent>[] =
      sessionPayloads
        .filter(
          (sessionEvent): sessionEvent is IEntityCommerceUserEvent =>
            sessionEvent != null
        )
        .map((sessionEvent) => {
          return {
            insertOne: {
              document: sessionEvent,
            },
          };
        });

    const bulkOp =
      await commerceUserEventService.genBulkWrite(bulkWritePayloads);
    console.log(`
            ---Product-view events seed complete---
            Total attempts: ${sessionPayloads.length}.
            Total success: ${bulkOp.insertedCount}.
            Total error: ${sessionPayloads.length - bulkOp.insertedCount}.
        `);
  }

  private async genSingleProductViewEventPayload(): Promise<IEntityCommerceUserEvent | null> {
    const user = await this.genSampleUser();
    const product = await this.genSampleProduct();
    return {
      _id: EntityCommerceUserService.getObjectId(),
      date: new Date(),
      event_type: 'product_view',
      user_id: user._id,
      commerce_reference_id: product._id,
    };
  }

  private async genSeedCheckoutEvents(numEvents: number): Promise<void> {
    console.log('---Seeding checkout events---');

    const sessionPayloadPromises = Array.from({ length: numEvents }).map(() =>
      this.genSingleCheckoutEventPayload()
    );
    const sessionPayloads = await Promise.all(sessionPayloadPromises);
    const bulkWritePayloads: AnyBulkWriteOperation<IEntityCommerceUserEvent>[] =
      sessionPayloads
        .filter(
          (sessionEvent): sessionEvent is IEntityCommerceUserEvent =>
            sessionEvent != null
        )
        .map((sessionEvent) => {
          return {
            insertOne: {
              document: sessionEvent,
            },
          };
        });

    const bulkOp =
      await commerceUserEventService.genBulkWrite(bulkWritePayloads);
    console.log(`
            ---Checkout events seed complete---
            Total attempts: ${sessionPayloads.length}.
            Total success: ${bulkOp.insertedCount}.
            Total error: ${sessionPayloads.length - bulkOp.insertedCount}.
        `);
  }

  private async genSingleCheckoutEventPayload(): Promise<IEntityCommerceUserEvent | null> {
    const user = await this.genSampleUser();
    return {
      _id: EntityCommerceUserService.getObjectId(),
      date: new Date(),
      event_type: 'checkout',
      user_id: user._id,
      commerce_reference_id: null,
    };
  }

  private async genSeedPurchaseEvents(numEvents: number): Promise<void> {
    console.log('---Seeding purchase events---');

    const sessionPayloadPromises = Array.from({ length: numEvents }).map(() =>
      this.genSinglePurchaseEventPayload()
    );
    const sessionPayloads = await Promise.all(sessionPayloadPromises);
    const bulkWritePayloads: AnyBulkWriteOperation<IEntityCommerceUserEvent>[] =
      sessionPayloads
        .filter(
          (sessionEvent): sessionEvent is IEntityCommerceUserEvent =>
            sessionEvent != null
        )
        .map((sessionEvent) => {
          return {
            insertOne: {
              document: sessionEvent,
            },
          };
        });

    const bulkOp =
      await commerceUserEventService.genBulkWrite(bulkWritePayloads);
    console.log(`
            ---Purchase events seed complete---
            Total attempts: ${sessionPayloads.length}.
            Total success: ${bulkOp.insertedCount}.
            Total error: ${sessionPayloads.length - bulkOp.insertedCount}.
        `);
  }

  private async genSinglePurchaseEventPayload(): Promise<IEntityCommerceUserEvent | null> {
    const user = await this.genSampleUser();
    const product = await this.genSampleProduct();
    return {
      _id: EntityCommerceUserService.getObjectId(),
      date: new Date(),
      event_type: 'purchase',
      user_id: user._id,
      commerce_reference_id: product._id,
    };
  }

  private async genSampleUser(): Promise<IEntityCommerceUser> {
    const user = await commerceUserService.genSampleOne();
    if (user == null) {
      throw new Error('Unable to sample user for session event');
    }
    return user;
  }

  private async genSampleProduct(): Promise<IEntityCommerceProduct> {
    const product = await commerceProductService.genSampleOne();
    if (product == null) {
      throw new Error('Unable to sample user for session event');
    }
    return product;
  }
}
