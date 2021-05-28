'use strict'
const React = require('react')
const { Text, Box } = require('ink')
const importJsx = require('import-jsx')
const gltfjsx = require('../gltfjsx')
const path = require('path')
const ErrorBoundary = importJsx('./ErrorBoundary')

function getFolderName(file) {
  return path.basename(path.dirname(file))
}

function snake2Pascal(str) {
  str += ''
  str = str.split('_')
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].slice(0, 1).toUpperCase() + str[i].slice(1, str[i].length)
  }
  return str.join('')
}

function Conversion({ file, ...config }) {
  let folderName = getFolderName(file)
  let modelName = snake2Pascal(folderName)

  let output = modelName + (config.types ? '.tsx' : '.js')

  const [done, setDone] = React.useState(false)
  const [log, setLog] = React.useState([])

  React.useEffect(() => {
    async function run() {
      try {
        await gltfjsx(file, modelName, folderName, output, { ...config, setLog, timeout: 0, delay: 5 })
        setDone(true)
      } catch (e) {
        setDone(() => {
          throw e
        })
      }
    }
    run()
  }, [])

  return (
    <>
      {!done && (
        <Box>
          <Text color="black" backgroundColor="white">
            {' Parse '}
          </Text>
          <Text> {(log[log.length - 1] || '').trim()}</Text>
        </Box>
      )}
      {done && (
        <Box>
          <Text color="black" backgroundColor="green">
            {' Done: '}
          </Text>
          <Text> {output}</Text>
        </Box>
      )}
    </>
  )
}

module.exports = function App(props) {
  return (
    <ErrorBoundary>
      <Conversion {...props} />
    </ErrorBoundary>
  )
}
