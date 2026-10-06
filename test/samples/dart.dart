import 'dart:async';
import 'package:flutter/material.dart';

/// A counter widget.
class Counter extends StatefulWidget {
  const Counter({super.key, this.initial = 0});
  final int initial;

  @override
  State<Counter> createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  late int _count = widget.initial;

  Future<void> _increment() async {
    await Future.delayed(const Duration(milliseconds: 100));
    setState(() => _count++);
  }

  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: _count < 10 ? _increment : null,
      child: Text('Count: $_count ${_count.isEven}'),
    );
  }
}
