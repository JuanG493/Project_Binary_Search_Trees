// BST

class Node {
  constructor(data = null, right = null, left = null) {
    this.value = data;
    this.right = right;
    this.left = left;
  }
}

class Tree {
  hash = {};
  constructor(root) {
    this.root = null;
  }
  // takes an array and turns it into a balanced binary tree
  buildTree(globalArry, flag = false) {
    let generalArray;
    if (!flag) {
      generalArray = this.sortedArray(globalArry);
    } else {
      generalArray = globalArry;
    }

    let start = 0;
    let end = generalArray.length - 1;
    let treeB = auxRecursion(generalArray, start, end);
    this.root = treeB;
    return this.root;

    function auxRecursion(arry, start, end) {
      if (start > end) {
        return null;
      } else {
        let newMidle = Math.trunc((start + end) / 2);
        let newNodo = new Node(generalArray[newMidle]);
        newNodo.left = auxRecursion(arry, start, newMidle - 1);
        newNodo.right = auxRecursion(arry, newMidle + 1, end);
        return newNodo;
      }
    }
  }

  //  sorted array using a hash
  sortedArray(str) {
    for (let i = 0; i < str.length; i++) {
      this.hash[str[i]] = str[i];
    }
    return Object.values(this.hash);
  }

  //  function that will console.log the tree in a structured format
  print() {
    const prettyPrint = (node, prefix = "", isLeft = true) => {
      if (node === null) {
        return;
      }
      if (node.right !== null) {
        prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
      }
      console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
      if (node.left !== null) {
        prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
      }
    };
    prettyPrint(this.root);
  }
  //  insert a value into
  insert(val) {
    let iter = this.root;
    while (iter instanceof Node) {
      if (val == iter.value) {
        return false;
      } else {
        if (val < iter.value) {
          //  this to prevent to point direct to the null elment,insted break before to mantein
          //  the correct pointer to the actual node.
          if (iter.left == null) {
            break;
          } else {
            iter = iter.left;
          }
        } else {
          if (iter.right == null) {
            break;
          } else {
            iter = iter.right;
          }
        }
      }
    }

    let newNode = new Node(val);
    val < iter.value ? (iter.left = newNode) : (iter.right = newNode);
    return this.root;
  }
  // accepts a value and returns the node with the given value.
  find(val) {
    let iter = this.root;
    while (iter instanceof Node) {
      if (val == iter.value) {
        return iter;
      } else {
        if (val < iter.value) {
          iter = iter.left;
        } else {
          iter = iter.right;
        }
      }
    }
    return iter;
  }
  //  delete a node of the tree take in account if have childs or if it is the root of the tree.
  delete(val) {
    //  find the node before of the target element that it is been deleting.
    function auxRecursion(iterator, target) {
      if (target == iterator.value) {
        return iterator;
      } else {
        if (target < iterator.value) {
          if (iterator.left.value == target) {
            return iterator;
          } else {
            return auxRecursion(iterator.left, target);
          }
        } else {
          if (iterator.right.value == target) {
            return iterator;
          } else {
            return auxRecursion(iterator.right, target);
          }
        }
      }
    }

    function findNextBiggest(nodeElm) {
      if (nodeElm.left != null) {
        return findNextBiggest(nodeElm.left);
      } else {
        return nodeElm;
      }
    }

    function childrenDontMatter(mainNode, focus) {
      //  search ahead for the Node before of the node that are been deleting.
      let fatherNode = auxRecursion(mainNode, focus);
      focus > fatherNode.value
        ? (fatherNode.right = null)
        : (fatherNode.left = null);
    }

    function childrenMatter(mainNode, focus) {
      let fatherNode = auxRecursion(mainNode, focus);
      let child = theNode.right != null ? theNode.right : theNode.left;
      focus > fatherNode.value
        ? (fatherNode.right = child)
        : (fatherNode.left = child);
    }
    //  start here
    let rootNode = this.root;
    let theNode = this.find(val);
    //   third case have two children
    if (theNode.right != null && theNode.left != null) {
      let nexBigNode = findNextBiggest(theNode.right);
      let newNodeValue = nexBigNode.value;

      // for this new node (next big) set the links of it´s children
      // two case are posible: no have child or have one child
      // are there children?
      if (nexBigNode.right == null && nexBigNode.left == null) {
        // no => delete free
        childrenDontMatter(rootNode, newNodeValue);
        theNode.value = newNodeValue;
        //yes => you better think next time that you want to have childrens
      } else {
        theNode.value = newNodeValue;
        theNode.right = nexBigNode.right;
      }
    }
    //  second case at least one child.
    else if (theNode.right != null || theNode.left != null) {
      childrenMatter(rootNode, val);
    }
    // first case for not children.
    else if (theNode.right == null && theNode.left == null) {
      childrenDontMatter(rootNode, val);
    }
  }
  //  accepts another function as a parameter traverse the tree in breadth-first level order
  //  and provide each node as the argument to the provided function.
  levelOrder(fun) {
    let result = [];
    let queue = [this.root];
    while (queue.length > 0) {
      let copy = queue;
      queue = [];
      copy.forEach((nodeElm) => {
        result.push(nodeElm);
        if (nodeElm.left != null) {
          queue.push(nodeElm.left);
        }
        if (nodeElm.right != null) {
          queue.push(nodeElm.right);
        }
      });
    }
    if (fun) {
      result.forEach((element) => {
        fun(element);
      });
    } else {
      return result;
    }
  }
  // traverse the tree in bradth-first lever order an provide each node as the argument to the provided function
  // if not fuction provide return array of elements.
  inOrder(fun, tree = this.root) {
    function auxRecursion(root) {
      if (!(root instanceof Node)) {
        return;
      } else {
        auxRecursion(root.left);
        result.push(root);
        auxRecursion(root.right);
      }
    }
    let result = [];
    auxRecursion(tree);
    if (fun) {
      result.forEach((element) => {
        fun(element);
      });
    } else {
      return result;
    }
  }

  postOrder(fun) {
    function auxRecursion(root) {
      if (!(root instanceof Node)) {
        return;
      } else {
        auxRecursion(root.left);
        auxRecursion(root.right);
        result.push(root);
      }
    }
    let result = [];
    auxRecursion(this.root);
    if (fun) {
      result.forEach((element) => {
        fun(element);
      });
    } else {
      return result;
    }
  }

  preOrder(fun) {
    function auxRecursion(root) {
      if (!(root instanceof Node)) {
        return;
      } else {
        result.push(root);
        auxRecursion(root.left);
        auxRecursion(root.right);
      }
    }
    let result = [];
    auxRecursion(this.root);
    if (fun) {
      result.forEach((element) => {
        fun(element);
      });
    } else {
      return result;
    }
  }

  //  Height is defined as the number of edges in longest path from a given node to a leaf node.
  height(nodeVal) {
    //  solution using levels, the height == max num of sublevels+1
    // let result = [];
    // let theNode = nodeVal ? this.find(nodeVal) : this.root;
    // let queue = [theNode];
    // while (queue.length > 0) {
    //     let copy = queue;
    //     queue = []
    //     let list = []
    //     copy.forEach(nodeElm => {
    //         list.push(nodeElm)
    //         if (nodeElm.left != null) {
    //             queue.push(nodeElm.left)
    //         }
    //         if (nodeElm.right != null) {
    //             queue.push(nodeElm.right)
    //         }
    //     });
    //     result.push(list)
    // }
    // let height = result.length - 1;

    function findHeight(node) {
      if (node == null) {
        return -1;
      } else {
        return Math.max(findHeight(node.left), findHeight(node.right)) + 1;
      }
    }
    if (this.cheekExistence(nodeVal)) {
      let nodeElm = this.find(nodeVal);
      let height = findHeight(nodeElm);
      return height;
    } else {
      return false;
    }
  }

  cheekExistence(val) {
    return this.hash[val] ? true : false;
  }
  //  Depth is defined as the number of edges in path from a given node to the tree’s root node.
  depth(valNode) {
    let depthCount = 0;
    function findDepth(root, target) {
      if (root.value == target) {
        return;
      } else {
        if (target < root.value) {
          depthCount += 1;
          findDepth(root.left, target);
        } else {
          depthCount += 1;
          findDepth(root.right, target);
        }
      }
      return depthCount;
    }
    return this.cheekExistence(valNode) ? findDepth(this.root, valNode) : false;
  }
  //  balanced tree is one where the difference between heights of left subtree and right subtree
  //  of every node is not more than 1.
  isBalanced() {
    let leftSide = this.height(this.root.left.value);
    let rightSide = this.height(this.root.right.value);
    return leftSide == rightSide ? "IS BALANCE" : "NOT BALANCE";
  }
  // use a traversal method to provide a new array to the buildTree function.
  rebalance() {
    let newArry = [];
    function takeVal(node) {
      newArry.push(node.value);
    }
    this.inOrder(takeVal);
    this.buildTree(newArry, false);
  }
}

//HOW TO USE
// 1. create a new instance of the Tree;
// let fruitsTre = new Tree();
// 2. to build the tree use the buildtree method that take´s parameters (array, boolean)
//    array can be oder o unsorted if it is sorted you can skip this step seting the boolean to true.

// fruitsTre.buildTree([1, 2, 3, 4, 5, 6, 7, 8, 9], true)
// fruitsTre.buildTree([2, 4, 8, 9, 1, 7, 2, 5, 3, 6]);
// fruitsTre.buildTree(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
// fruitsTre.buildTree([20, 10, 25, 45, 5, 30, 15, 35]);
// fruitsTre.buildTree([100, 20, 60, 80, 40, 10, 90])

// 3. use the methods
// fruitsTre.print();
// fruitsTre.insert(5)
// fruitsTre.insert(4)
// fruitsTre.insert(6)
// fruitsTre.insert(2)
// fruitsTre.insert(1)
// let test = fruitsTre.find(4)
// console.log(test);
// fruitsTre.delete(4) // no child
// fruitsTre.delete(8) // one child
// fruitsTre.delete(7) //two childs
// fruitsTre.delete(2)
// fruitsTre.delete(9)
// fruitsTre.delete(6)
// fruitsTre.delete(60)
// fruitsTre.delete(100)
// fruitsTre.delete(20)

// fruitsTre.delete(5)
// fruitsTre.print();

//breadthFirst
// function breadthFirstLevel(node) {
//     console.log(node.value);
// }
// fruitsTre.inOrder(breadthFirstLevel)
// console.log(fruitsTre.levelOrder());

//inOrder
// function inOrderFun(node) {
//     console.log(node.value);
// }
// fruitsTre.inOrder(inOrderFun);
// console.log(fruitsTre.inOrder());

//PostOrder
// function postOrederFun(node) {
//     console.log(node.value);
// }
// fruitsTre.postOrder(inOrderFun);
// console.log(fruitsTre.postOrder());

// PreOrder
// function preOrderFun(node) {
//     console.log(node.value);
// }
// fruitsTre.preOrder(preOrderFun);
// console.log(fruitsTre.preOrder());

// fruitsTre.insert(10)
// fruitsTre.insert(11)
// fruitsTre.insert(12)
// fruitsTre.insert(13)

// fruitsTre.print();
// fruitsTre.print();
// console.log(fruitsTre.height(10));
// fruitsTre.delete(7)
// fruitsTre.print()

// console.log(fruitsTre.depth(9))
// console.log(fruitsTre.height(10));
// console.log(fruitsTre.height(10));
// fruitsTre.insert(10);

// fruitsTre.insert(11);
// fruitsTre.insert(4.2)
// // fruitsTre.print();
// // console.log(fruitsTre.height(5));
// // console.log(fruitsTre.isBalanced());

// // fruitsTre.rebalance();
// fruitsTre.print();
// console.log(fruitsTre.isBalanced());

// tie it all together

let myRandomNums = [];
for (let i = 0; i < 100; i++) {
  let randNum = Math.floor(Math.random() * 99);
  myRandomNums.push(randNum);
}

console.log(myRandomNums);
let randimTree = new Tree();
randimTree.buildTree(myRandomNums);
randimTree.print();
// isBalanced?
console.log(randimTree.isBalanced());

//levelOrder.
let arryLevelOrder = [];
function levelOrderFun(node) {
  arryLevelOrder.push(node.value);
}
randimTree.levelOrder(levelOrderFun);
console.log("level Order:", arryLevelOrder);

//inOrder
let arryInOrder = [];
function inOrderFun(node) {
  arryInOrder.push(node.value);
}
randimTree.inOrder(inOrderFun);
console.log("In order:", arryInOrder);

//PostOrder
let arryPostOrder = [];
function postOrderFun(node) {
  arryPostOrder.push(node.value);
}
randimTree.postOrder(postOrderFun);
console.log("Post Order: ", arryInOrder);

// PreOrder
let arryPreOrder = [];
function preOrderFun(node) {
  arryPreOrder.push(node.value);
}
randimTree.preOrder(preOrderFun);
console.log("PreOrder: ", arryInOrder);

// adding elements to unbalance the tree.
randimTree.insert(120);
randimTree.insert(111);
randimTree.insert(110);
randimTree.insert(150);
randimTree.print();
// isBalanced?
console.log(randimTree.isBalanced());
randimTree.rebalance();
randimTree.print();
// isBalanced?
console.log(randimTree.isBalanced());

//  arrays of nodes using the order.
console.log(randimTree.levelOrder());
console.log(randimTree.inOrder());
console.log(randimTree.preOrder());
console.log(randimTree.postOrder());
