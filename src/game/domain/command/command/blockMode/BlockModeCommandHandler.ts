import Logger from '@/core/infra/logger/Logger';
import BlockModeCommand from '@/game/domain/command/command/blockMode/BlockModeCommand';
import World from '@/core/domain/World';
import Player from '@/core/domain/entities/game/player/Player';
import CommandHandler from '../../CommandHandler';

const BlockModes = {
    Trade: 1,
    Group: 2,
    Guild: 4,
    Whisper: 8,
    Friends: 16,
    Request: 32,
};

export default class BlockModeCommandHandler extends CommandHandler<BlockModeCommand> {
    private logger: Logger;
    private world: World;

    constructor({ logger, world }) {
        super();
        this.logger = logger;
        this.world = world;
    }

    async execute(player: Player, blockModeCommand: BlockModeCommand) {
        if (!blockModeCommand.isValid()) {
            const errors = blockModeCommand.errors();
            this.logger.error(blockModeCommand.getErrorMessage());
            player.sendCommandErrors(errors);
            return;
        }

        // The client keeps track of which buttons are toggled.
        // So mode can be 3 when Trade and Group are active.
        const [mode] = blockModeCommand.getArgs();

        if (player) {
            player.setBlockMode(Number(mode));
            player.sendBlockMode();
            return;
        }
    }
}
