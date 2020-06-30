// 苦力怕物件
class Creeper {
  constructor(sizeScale, massScale, index,index2) {
    const headGeo = new THREE.CylinderGeometry(
      1 * sizeScale,
      1 * sizeScale,
      1 * sizeScale,
      50
    )
    const bodyGeo = new THREE.CylinderGeometry(
      1 * sizeScale,
      1 * sizeScale,
      5 * sizeScale,
      50
    )
    const bodyGeo2 = new THREE.CylinderGeometry(
      0.9 * sizeScale,
      1.4 * sizeScale,
      3.5 * sizeScale,
      50
    )
    const bodyGeo3 = new THREE.SphereGeometry(
      2 * sizeScale,
      50,
      50
    )
    const footGeo = new THREE.CylinderGeometry(
      2 * sizeScale,
      2 * sizeScale,
      7 * sizeScale,
      50
    )

    const skinMat = new THREE.MeshStandardMaterial({
      color: 0x000000,  //55ac44
      roughness: 0.3, // 粗糙度
      metalness: 0.1, // 金屬感
      transparent: true, // 透明與否
      //opacity: 0.7, // 透明度
      //side: THREE.DoubleSide, // 雙面材質
    })

    const wineMat = new THREE.MeshPhongMaterial({ color: 0xD42929 })

    //頭
    this.head = new THREE.Mesh(headGeo, wineMat)
    this.head.position.set(index * 10, 12 * sizeScale, index2 * 10)

    const headShape = new CANNON.Cylinder(
      1 * sizeScale, 1 * sizeScale, 1 * sizeScale, 10
    )
    this.headBody = new CANNON.Body({
      mass: 1 * massScale,
      position: new CANNON.Vec3(index * 10, 12 * sizeScale, index2 * 10)
    })
    this.headBody.addShape(headShape)

    //身1
    this.body = new THREE.Mesh(bodyGeo, wineMat)
    this.body.position.set(index * 10, 10.5 * sizeScale, index2 * 10)

    const bodyShape = new CANNON.Cylinder(
      1 * sizeScale, 1 * sizeScale, 5 * sizeScale, 10
    )
    this.bodyBody = new CANNON.Body({
      mass: 1 * massScale,
      position: new CANNON.Vec3(index * 10, 10.5 * sizeScale, index2 * 10)
    })
    this.bodyBody.addShape(bodyShape)

    //身2
    this.body2 = new THREE.Mesh(bodyGeo2, skinMat)
    this.body2.position.set(index * 10, 8 * sizeScale, index2 * 10)

    const bodyShape2 = new CANNON.Cylinder(
      1 * sizeScale, 1 * sizeScale, 5 * sizeScale, 10
    )
    this.bodyBody2 = new CANNON.Body({
      mass: 1 * massScale,
      position: new CANNON.Vec3(index * 10, 8 * sizeScale, index2 * 10)
    })
    this.bodyBody2.addShape(bodyShape2)

    //身3
    this.body3 = new THREE.Mesh(bodyGeo3, skinMat)
    this.body3.position.set(index * 10, 7 * sizeScale, index2 * 10)

    const bodyShape3 = new CANNON.Sphere(
      1 * sizeScale
    )
    this.bodyBody3 = new CANNON.Body({
      mass: 1 * massScale,
      position: new CANNON.Vec3(index * 10, 7 * sizeScale, index2 * 10)
    })
    this.bodyBody3.addShape(bodyShape3)

    //腳
    this.leftFrontLeg = new THREE.Mesh(footGeo, skinMat)
    this.leftFrontLeg.position.set(index * 10, 3.5 * sizeScale, index2 * 10)

    const footShape = new CANNON.Cylinder(
      3.7 * sizeScale, 4 * sizeScale, 7 * sizeScale, 10
    )
    this.leftFrontLegBody = new CANNON.Body({
      mass: 10 * massScale,
      position: new CANNON.Vec3(index * 10, 3.5 * sizeScale, index2 * 10)
    })
    this.leftFrontLegBody.addShape(footShape)

    // Head joint
    this.headjoint = new CANNON.LockConstraint(this.headBody, this.bodyBody)
    this.headjoint2 = new CANNON.LockConstraint(this.headBody, this.bodyBody2)
    this.headjoint3 = new CANNON.LockConstraint(this.headBody, this.bodyBody3)
    this.headjoint4 = new CANNON.LockConstraint(this.headBody, this.leftFrontLegBody)

    // Body joint
    this.BodyJoint = new CANNON.LockConstraint(this.bodyBody2,this.bodyBody)
    this.BodyJoint2 = new CANNON.LockConstraint(this.bodyBody3,this.bodyBody)
    this.BodyJoint3 = new CANNON.LockConstraint(this.leftFrontLegBody,this.bodyBody)

    // Body2 joint
    this.Body2Joint = new CANNON.LockConstraint(this.bodyBody3,this.bodyBody2)
    this.Body2Joint2 = new CANNON.LockConstraint(this.leftFrontLegBody,this.bodyBody2)

    // Body3 joint
    this.Body3Joint = new CANNON.LockConstraint(this.leftFrontLegBody,this.bodyBody)


    this.isKnockOut = false
    this.walkSpeed = 0
    this.scaleHeadOffset = 0
    this.tween
    this.tweenBack

    this.feet = new THREE.Group()
    this.feet.add(this.leftFrontLeg) // 前腳左

    this.creeper = new THREE.Group()
    this.creeper.add(this.head)
    this.creeper.add(this.body)
    this.creeper.add(this.body2)
    this.creeper.add(this.body3)
    this.creeper.add(this.feet)
    this.creeper.name = 'creeper'

    this.creeper.traverse(function (object) {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true
        object.receiveShadow = true
      }
    })
  }

  updateMesh() {
    this.head.position.copy(this.headBody.position)
    this.head.quaternion.copy(this.headBody.quaternion)
    this.body.position.copy(this.bodyBody.position)
    this.body.quaternion.copy(this.bodyBody.quaternion)
    this.body2.position.copy(this.bodyBody2.position)
    this.body2.quaternion.copy(this.bodyBody2.quaternion)
    this.body3.position.copy(this.bodyBody3.position)
    this.body3.quaternion.copy(this.bodyBody3.quaternion)
    this.leftFrontLeg.position.copy(this.leftFrontLegBody.position)
    this.leftFrontLeg.quaternion.copy(this.leftFrontLegBody.quaternion)
  }

  tweenHandler() {
    let offset = { x: 0, z: 0, rotateY: 0 }
    let target = { x: 100, z: 100, rotateY: 0.7853981633974484 } // 目標值

    // 苦力怕走動及轉身補間動畫
    const onUpdate = () => {
      // 移動
      this.feet.position.x = offset.x
      this.feet.position.z = offset.z
      this.head.position.x = offset.x
      this.head.position.z = offset.z
      this.body.position.x = offset.x
      this.body.position.z = offset.z
      this.body2.position.x = offset.x
      this.body2.position.z = offset.z
      this.body3.position.x = offset.x
      this.body3.position.z = offset.z
      pointLight.position.x = offset.x - 20
      pointLight.position.z = offset.z + 20

      // 轉身
      if (target.x > 0) {
        this.feet.rotation.y = offset.rotateY
        this.head.rotation.y = offset.rotateY
        this.body.rotation.y = offset.rotateY
        this.body2.rotation.y = offset.rotateY
        this.body3.rotation.y = offset.rotateY
      } else {
        this.feet.rotation.y = -offset.rotateY
        this.head.rotation.y = -offset.rotateY
        this.body.rotation.y = -offset.rotateY
        this.body2.rotation.y = -offset.rotateY
        this.body3.rotation.y = -offset.rotateY
      }
    }

    // 計算新的目標值
    const handleNewTarget = () => {
      // 限制苦力怕走路邊界
      const range = 100
      if (camera.position.x > range) target.x = range
      else if (camera.position.x < -range) target.x = -range
      else target.x = camera.position.x
      if (camera.position.z > range) target.z = range
      else if (camera.position.z < -range) target.z = -range
      else target.z = camera.position.z

      const v1 = new THREE.Vector2(0, 1) // 原點面向方向
      const v2 = new THREE.Vector2(target.x, target.z) // 苦力怕面向新相機方向

      // 內積除以純量得兩向量 cos 值
      let cosValue = v1.dot(v2) / (v1.length() * v2.length())

      // 防呆，cos 值區間為（-1, 1）
      if (cosValue > 1) cosValue = 1
      else if (cosValue < -1) cosValue = -1

      // cos 值求轉身角度
      target.rotateY = Math.acos(cosValue)
    }

    // 計算新的目標值
    const handleNewTweenBackTarget = () => {
      // 限制苦力怕走路邊界
      const range = 150
      const tmpX = target.x
      const tmpZ = target.z

      target.x = THREE.Math.randFloat(-range, range)
      target.z = THREE.Math.randFloat(-range, range)

      const v1 = new THREE.Vector2(tmpX, tmpZ)
      const v2 = new THREE.Vector2(target.x, target.z)

      // 內積除以純量得兩向量 cos 值
      let cosValue = v1.dot(v2) / (v1.length() * v2.length())

      // 防呆，cos 值區間為（-1, 1）
      if (cosValue > 1) cosValue = 1
      else if (cosValue < -1) cosValue = -1

      // cos 值求轉身角度
      target.rotateY = Math.acos(cosValue)
    }

    // 朝相機移動
    this.tween = new TWEEN.Tween(offset)
      .to(target, 15000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(onUpdate)
      .onComplete(() => {
        handleNewTweenBackTarget()
        this.tweenBack.start()
      })

    // 隨機移動
    this.tweenBack = new TWEEN.Tween(offset)
      .to(target, 15000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(onUpdate)
      .onComplete(() => {
        handleNewTarget() // 計算新的目標值
        this.tween.start()
      })
  }

  creeperFeetWalk() {
    this.walkSpeed += 0.04
    this.leftFrontLeg.rotation.x = Math.sin(this.walkSpeed) / 4
  }

  creeperScaleBody() {
    this.scaleHeadOffset += 0.04
    let scaleRate = Math.abs(Math.sin(this.scaleHeadOffset)) / 16 + 1
    this.creeper.scale.set(scaleRate, scaleRate, scaleRate)
  }
}
