import { AbstractQuest } from '../AbstractQuest';
import { Quest, Task, TaskResult } from '@/core/domain/quests/decorators/QuestDecorator';
import { QuestEventEnum } from '@/core/enum/QuestEventEnum';

enum WelcomeQuestState {
    START = 'START',
}

@Quest('WelcomeQuest', WelcomeQuestState.START)
export class WelcomeQuest extends AbstractQuest {
    @Task({ state: WelcomeQuestState.START, when: QuestEventEnum.LOGIN })
    public async start(): Promise<TaskResult> {
        this.title('Welcome to Open mt2 project');
        this.text('Enjoy it');
        await this.nextPage();
        this.text('This is an example of next page in quests');
        this.text('Select one option: ');
        const option = await this.select(['Pizza', 'Hamburger']);
        this.text(`You selected ${option <= 0 ? 'Pizza' : 'Hamburger'}`);
    }
}
