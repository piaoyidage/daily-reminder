// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

let timer = null
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "daily-reminder" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.dailyReminder', function () {
		// The code you place here will be executed every time your command is executed
		// 获取 package.josn 里面的配置
		const { onDuty, offDuty, onDutyTip, offDutyTip, defaultTip } = vscode.workspace.getConfiguration('remind')
		const [ onDutyHour, onDutyMinute ] = onDuty.split(':')
		const [ offDutyHour, offDutyMinute ] = offDuty.split(':')
		// 简单校验一下配置的时间符不符合格式
		const regTime = /^([01][0-9]|2[0-3]):([0-5][0-9])$/
		// 格式化 Date 获取的小时和分钟
		const format = (num, len = 2) => `0${num}`.slice(-len)
		const showTip = () => {
			const date = new Date()
			const curHour = format(date.getHours())
			const curMinute = format(date.getMinutes())
			if (onDutyHour === curHour && onDutyMinute === curMinute) {
				vscode.window.showWarningMessage(onDutyTip)
			} else if (offDutyHour === curHour && offDutyMinute === curMinute) {
				vscode.window.showWarningMessage(offDutyTip)
			}
		}
		if (regTime.test(onDuty) && regTime.test(offDuty)) {
			if (timer) {
				clearInterval(timer)
			}
			timer = setInterval(showTip, 60000)
			showTip()
		}

		if (defaultTip) {
			vscode.window.showInformationMessage(defaultTip)			
		}
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
