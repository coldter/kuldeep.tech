import { UserConfig } from "./src/config"

const userConfig: UserConfig = {
    base_url: "https://kuldeep.tech",
    mount: {
        manual: true,
        page_url: 'https://kldp.notion.site/Public-Hugo-1bfe920b046e8063ad4adba71ea82a56',
        pages: [
            // {
            //     page_id: '<page_id>',
            //     target_folder: 'path/relative/to/content/folder'
            // }
        ],
        databases: [
            // {
            //     database_id: '<database_id>',
            //     target_folder: 'path/relative/to/content/folder'
            // }
            {
                database_id: "1bfe920b046e814ea141ff0c4771dc4e",
                target_folder: 'posts/notion'
            }
        ],
    }
}

export default userConfig;