/**
 *
 * TimmyRB
 * December 9, 2020
 * The following file is used to handle generating custom images for code files
 *
 * Updates
 * -------
 *
 *
 */

// Import the requried items
import * as Discord from 'discord.js';
import Axios, * as axios from 'axios';
import { diary } from '../funcs';
import { createWriteStream } from 'fs';

/**
 *
 * The following function is used to handle cleaning up the specified amount of messages in the channel
 *
 * @param message: is the message to handle
 * @param args: is the array of events
 *
 */
export function codeify(message: Discord.Message) {
    let codeExt = ['dart', 'cpp', 'html', 'htm', 'js', 'ts', 'css', 'sh', 'go', 'java', 'xml', 'lua', 'kt', 'md', 'php', 'yaml', 'tsx', 'jsx', 'h', 'm', 'swift', 'gradle', 'py', 'json']
    let colors = ['rgba(152,229,69,1)', 'rgba(74,144,226,1)', 'rgba(227,58,78,1)', 'rgba(254,192,92,1)', 'rgba(144,19,254,1)', 'rgba(126,211,33,1)']

    let attachments = message.attachments
    attachments.forEach(attachment => {
        let dot = attachment.name.lastIndexOf('.')
        let ext = attachment.name.substring(dot + 1)

        if (codeExt.includes(ext)) {
            let name = `${Date.now().toString()}-codeImage${Math.round(Math.random() * 500)}.png`
            let writer = createWriteStream(`codeImages/${name}`);
            axios.default.get(attachment.url).then(res => {
                axios.default({
                    method: 'POST',
                    url: 'https://carbonara.now.sh/api/cook',
                    data: {
                        code: res.data,
                        backgroundColor: colors[Math.round(Math.random() * (colors.length - 1))],
                        theme: 'material'
                    },
                    responseType: 'stream'
                }).then(res => {
                    res.data.pipe(writer)
                    let error: boolean = false;
                    writer.on('error', err => {
                        writer.close();
                        error = true;
                        console.error(err)
                    });
                    writer.on('close', () => {
                        if (!error) {
                            message.channel.send({
                                files: [{
                                    attachment: `codeImages/${name}`,
                                    name: name
                                }]
                            }).catch(err => console.error(err))
                        }
                      });
                }).catch(err => console.error(err))
            }).catch(err => console.error(err))
        }

    })

    // Return to stop further processing
    return;
}