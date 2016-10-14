import sprintf from 'sprintf'

export const makeTextLabel = (game, text, fontSize = 7) => {
  return new Phaser.BitmapText(game, 0, 0, 'carrier_command', text, fontSize)
}

export const verticallyLayoutComponents = (components, startPosition, gap) => {
  let current = startPosition.y
  components.forEach((component, index) => {
    component.x = startPosition.x
    component.y = current
    current += component.height + gap
  })
  return components
}

function _localToGlobal(displayObject, point, relativeTo = null) {
  let ret = {
    x: point.x + displayObject.x,
    y: point.y + displayObject.y
  }
  let parent = displayObject.parent
  if (parent && parent !== relativeTo) {
    return _localToGlobal(displayObject.parent, ret)
  } else {
    return ret
  }
}

export const localToGlobal = _localToGlobal

function _globalToLocal(displayObject, point, relativeTo = null) {
  let ret = {
    x: point.x - displayObject.x,
    y: point.y - displayObject.y
  }
  let parent = displayObject.parent
  if (parent && parent !== relativeTo) {
    return _globalToLocal(displayObject.parent, ret)
  } else {
    return ret
  }
}

export const globalToLocal = _globalToLocal

export const calculateLengthBetweenPoints = (p1, p2) => {
  return Math.sqrt(
    Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
  )
}

export const calculateLengthOfLine = (line) => {
  let ret = 0

  if (line.length === 1) {
    return ret
  }

  for (let i = 1; i < line.length; i++) {
    ret += calculateLengthBetweenPoints(line[i - 1], line[i])
  }

  return ret
}

export const calculateAvgPath = (length, line, step) => {
  let current = 0
  let currentStep = 1
  let ret = []
  ret.push(line[0])
  for (let i = 1; i < line.length; i++) {
    current += calculateLengthBetweenPoints(line[i - 1], line[i])
    if (current >= length * currentStep / step) {
      ret.push(line[i])
      currentStep += 1
    }
  }
  return ret
}

export const formatFloat = (v) => {
  return Number(sprintf('%0.2f', v))
}

export const formatPercent = (v) => {
  return formatFloat(v * 100) + '%'
}

export const rectCircleColliding = (rect, circle) => {
  var distX = Math.abs(circle.x - rect.x - rect.w / 2);
  var distY = Math.abs(circle.y - rect.y - rect.h / 2);

  if (distX > (rect.w / 2 + circle.r)) {
    return false;
  }
  if (distY > (rect.h / 2 + circle.r)) {
    return false;
  }

  if (distX <= (rect.w / 2)) {
    return true;
  }
  if (distY <= (rect.h / 2)) {
    return true;
  }

  var dx = distX - rect.w / 2;
  var dy = distY - rect.h / 2;
  return (dx * dx + dy * dy <= (circle.r * circle.r));
}

export const circlesColliding = (circle1, circle2) => {
  var dx = circle1.x - circle2.x;
  var dy = circle1.y - circle2.y;
  var distance = Math.sqrt(dx * dx + dy * dy);
  return (distance < circle1.radius + circle2.radius)
}

export const getEnemiesInTowerRange = (tower, enemies) => {
  let towerRadius = tower.getProp('radius')
  let c1 = {x: tower.x + tower.width / 2, y: tower.y + tower.height / 2, radius: towerRadius}

  return enemies.filter(enemy => {
    let c2 = {x: enemy.x, y: enemy.y, radius: enemy.width / 2}
    let flag = circlesColliding(c1, c2)
    // console.log(flag)
    return flag
  })
}

export const findBestTarget = (enemies) => {
  return enemies.length > 0 ? enemies[0] : null
}

export const getTargetAngle = (p1, p2) => {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x)
}

export const getTargetAngleDegree = (p1, p2) => {
  return getTargetAngle(p1, p2) * 180 / Math.PI
}

export const getPositionOfVector = (p, angle, length) => {
  let x = Math.cos(angle) * length
  let y = Math.sin(angle) * length
  return {x: p.x + x, y: p.y + y}
}