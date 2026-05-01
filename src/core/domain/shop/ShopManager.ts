import Shop from '@/core/domain/shop/Shop';
import { ShopItem } from '@/core/domain/shop/ShopItem';
import Logger from '@/core/infra/logger/Logger';
import ItemManager from '@/core/domain/manager/ItemManager';
import npcShops from '@/core/infra/config/data/npc_shop.json';

type NpcShopEntry = {
    npcVnum: number;
    shopName: string;
    items: Array<{ vnum: number; count: number }>;
};

export default class ShopManager {
    private readonly logger: Logger;
    private readonly itemManager: ItemManager;

    // vnum → Shop (NPC shops loaded from config)
    private readonly shops: Map<number, Shop> = new Map();

    constructor({ logger, itemManager }: { logger: Logger; itemManager: ItemManager }) {
        this.logger = logger;
        this.itemManager = itemManager;
    }

    load() {
        (npcShops as NpcShopEntry[]).forEach((entry) => {
            const shopItems: ShopItem[] = [];

            entry.items.forEach(({ vnum, count }) => {
                const item = this.itemManager.getItem(vnum, count);
                if (!item) {
                    this.logger.info(`[ShopManager] Unknown item vnum ${vnum} in shop for NPC ${entry.npcVnum}`);
                    return;
                }

                shopItems.push({
                    vnum,
                    count,
                    price: item.getShopPrice(),
                    item,
                });
            });

            const shop = new Shop({
                npcVnum: entry.npcVnum,
                shopName: entry.shopName,
                items: shopItems,
            });

            this.shops.set(entry.npcVnum, shop);
            this.logger.info(
                `[ShopManager] Loaded shop for NPC vnum ${entry.npcVnum} "${entry.shopName}" with ${shopItems.length} item(s)`,
            );
        });
    }

    hasShop(npcVnum: number): boolean {
        return this.shops.has(npcVnum);
    }

    getShop(npcVnum: number): Shop | undefined {
        return this.shops.get(npcVnum);
    }
}
