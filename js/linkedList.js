function circularLinkedList() {
    // Function to create Node
    let Node = function(data) {
        this.data = data;
        this.next = null;
    }

    // Below is private properties
    let length = 0;
    let head = null;

    // Get element at specific index
    this.getElementAt = function(index) {
        if(index >= 0 && index <= length) {
            let node = head;
            for(let i = 0; i < index && node != null; i++) {
                node = node.next;
            }
            return node;
        }
        return undefined;
    }

    // Add new Node to the list - add to the last
    this.add = function(data) {
        const node = new Node(data);
        let current;

        if(head === null) {
            head = node;
        } else {
            current = this.getElementAt(length - 1);
            current.next = node;
        }

        node.next = head; // This is how a circular linked list is formed because the last node points to the head
        length++;
    }

    // Insert new Node to the list
    this.insert = function(data, index) {
        if (index >= 0 && index <= length) {
            const node = new Node(data)
            let current = head

            if(index === 0) {
                if(head === null) {
                    head = node
                    node.next = head 
                } else {
                    node.next = head
                    current = this.getElementAt(length)
                    head = node
                    current.next = head
                }
            } else {
                const previous = this.getElementAt(index - 1)
                node.next = previous.next
                previous.next = node
            }

            length++
            return true
        }
        return false
    }

    // Remove element at any position
    this.removeAt = function(index) {
        if(index >= 0 && index <= length) {
            let current = head

            if(index === 0) {
                if(length === 1) {
                    head = undefined
                } else {
                    const removed = head
                    current = this.getElementAt(length - 1)
                    head = head.next
                    current.next = head
                    current = removed // You want to return what node was removed
                }
            } else {
                const previous = this.getElementAt(index - 1)
                current = previous.next
                previous.next = current.next
            }

            length--
            return current.data
        }
        return undefined
    }

    // Remove element having a specific data
    this.removeName = function(itemName) {
        let current = head, index = 0
        if(length === 1) {
            head = undefined
        } else {
            while(true) {
                let name = current.data.name
                if(name === itemName) {
                    console.log(name)
                    break
                } else {
                    current = current.next
                    index++
                    if(index === length - 1) {
                        break
                    }
                }
            }
            this.removeAt(index)
        }
    }

    // Get length of the linked list
    this.length = function() {
        return length
    }

    // Get the head node
    this.headNode = function() {
        return head
    }
    
    this.removeAll = function() {
        length = 0
        head = null
    }
}